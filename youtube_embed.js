var embedUrlBase = "https://www.youtube.com/embed/"
var defaultVideoId = "7UfVr5Xib50"
var embedUrl;

function embedMe(element) {
    var urlInput = document.getElementById('url')
    urlInput.value = element.firstChild.innerHTML
    var event = new Event("change")
    urlInput.dispatchEvent(event)
}

function clearInput() {
    console.log("Clearing input...")
    document.getElementById('url').value = "";
    cleanErrorMsg()
}

function switchMode() {
    var body = document.getElementById("body");
    var clearButton = document.getElementById("clearButton");
    var urlInput = document.getElementById("url");
    var searchInput = document.getElementById("seachInput");
    var cardBodies = document.getElementsByClassName("card-body")
    if (body.className.includes("bg-dark")) {
        console.log("Switching to light mode...")
        body.classList.remove("text-opacity-50")
        body.classList.remove("bg-dark")
        body.classList.add("text-danger")
        body.classList.add("bg-light")
        clearButton.classList.remove("btn-outline-danger")
        clearButton.classList.add("btn-danger")
        urlInput.classList.remove("bg-dark")
        urlInput.classList.remove("border-danger")
        urlInput.style.color = ""
        searchInput.classList.remove("bg-dark")
        searchInput.classList.remove("border-danger")
        searchInput.style.color = ""
        for (var i = 0; i < cardBodies.length; i++) {
            cardBodies[i].classList.remove("bg-black")
        }
    } else {
        console.log("Switching to dark mode...")
        body.classList.add("bg-dark")
        body.classList.add("text-opacity-50")
        body.classList.remove("bg-light")
        clearButton.classList.add("btn-outline-danger")
        clearButton.classList.remove("btn-danger")
        urlInput.classList.add("bg-dark")
        urlInput.classList.add("border-danger")
        urlInput.style.color = "#ff0000c6"
        searchInput.classList.add("bg-dark")
        searchInput.classList.add("border-danger")
        searchInput.style.color = "#ff0000c6"
        for (var i = 0; i < cardBodies.length; i++) {
            cardBodies[i].classList.add("bg-black")
        }
    }
}

function isNullOrEmpty(str) {
    return str == null || str === ""
}

function setDefaultVideoUrl() {
    embedUrl = embedUrlBase + defaultVideoId;
    console.log('Set embed url to default: ' + embedUrl)
}

function setErrorMsg(message) {
    var errorElement = document.getElementById("errorMsg")
    errorElement.innerHTML = message
}

function cleanErrorMsg() {
    document.getElementById("errorMsg").innerHTML = ""
}

function checkUrlValidity(str) {
    var reg = new RegExp(/^http(s)*:\/\/(www\.)*youtu(\.)*be(\.com)*\/.+/gm)
    if (!reg.test(str)) {
        throw new Error('Not a YouTube link')
    }
}

function setVideoUrl() {

    try {
        let url = document.getElementById('url').value.replaceAll(" ", "");
        console.log('url inserted is: ' + url)
        checkUrlValidity(url)

        let urlObj = new URL(url);
        let path = urlObj.pathname.replace('/', '');
        let params = urlObj.searchParams
        let vParam = params.get('v')
        let listParam = params.get('list')
        let indexParam = params.get('index')
        if (isNullOrEmpty(vParam) && isNullOrEmpty(listParam) && isNullOrEmpty(indexParam) && !isNullOrEmpty(path)) {   // like https://youtu.be/7UfVr5Xib50 or https://www.youtube.com/shorts/CnvAdvqZVPY
            let videoId = urlObj.pathname.replace("shorts", "").replaceAll('/', '');
            console.log(videoId)
            embedUrl = embedUrlBase + videoId;
            console.log('Set embed url for single video - no v param: ' + embedUrl)
            cleanErrorMsg()
        } else if (!isNullOrEmpty(vParam) && isNullOrEmpty(listParam) && isNullOrEmpty(indexParam)) {                   // like https://www.youtube.com/watch?v=7UfVr5Xib50
            embedUrl = embedUrlBase + vParam
            console.log('Set embed url for single video - with v param: ' + embedUrl)
            cleanErrorMsg()
        } else if (!isNullOrEmpty(listParam) && isNullOrEmpty(indexParam)) {                                            // like https://youtube.com/playlist?list=PLpT23Oq1XOBCs3qJY2GXBgxJUvtp6eC5g
            embedUrl = embedUrlBase + "videoseries?list=" + listParam                                                   // or   https://www.youtube.com/watch?v=uOJDCEapPpM&list=PLpT23Oq1XOBCs3qJY2GXBgxJUvtp6eC5g
            console.log('Set embed url for playlist - no index: ' + embedUrl)
            cleanErrorMsg()
        } else if (!isNullOrEmpty(listParam) && !isNullOrEmpty(indexParam)) {                                           // like https://www.youtube.com/watch?v=uOJDCEapPpM&list=PLpT23Oq1XOBCs3qJY2GXBgxJUvtp6eC5g&index=2
            embedUrl = embedUrlBase + "playlist?list=" + listParam + "&index=" + indexParam
            console.log('Set embed url for playlist - with index: ' + embedUrl)
            cleanErrorMsg()
        } else {
            console.log("Unknown url type. Will set default")
            setDefaultVideoUrl()
            setErrorMsg("Unknown link type. Try a different one, or listen to what we've picked for you. :)")
        }
    } catch (error) {
        console.error("Error occurred while setting video url: " + error)
        setDefaultVideoUrl()
        setErrorMsg("Invalid link. Try a different one, or listen to what we've picked for you. :)")

    }
    document.getElementById('video').setAttribute('src', embedUrl);
}

function setVideoDimensions() {
    var videoSectionParentWidth = document.getElementById("videoSectionParent").clientWidth;
    var heightToWidthRatio = 0.5625
    var margin = 0.8
    var videoWidth = Math.round(videoSectionParentWidth * margin)
    var videoHeight = Math.round(videoWidth * heightToWidthRatio)
    console.log("Current window width is: " + videoSectionParentWidth)
    console.log("Video will have width: " + videoWidth)
    console.log("Video will have height: " + videoHeight)
    document.getElementById('video').setAttribute('width', videoWidth);
    document.getElementById('video').setAttribute('height', videoHeight);
}

function embedVideo() {
    setVideoUrl()
    setVideoDimensions()
    document.getElementById('videoSection').style.visibility = "visible";
}