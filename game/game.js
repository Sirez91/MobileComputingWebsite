const fps = 30;
var count = 0;
var fullscreenElement;

const manageGame = function () {
    drawBackground();
    move();
    drawMovingObjects();
}

//wird beim Start ausgeführt
window.onload = function () {
    fullscreenElement = document.getElementById("fullscreen");
    //setInterval(manageGame, 1000 / fps);
}

//Makes the "fullscreenElement" fill the whole screen
function startFullscreen() {

    if (fullscreenElement.requestFullscreen) {
        fullscreenElement.requestFullscreen();
    } else if (fullscreenElement.mozRequestFullScreen) { /* Firefox */
        fullscreenElement.mozRequestFullScreen();
    } else if (fullscreenElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        fullscreenElement.webkitRequestFullscreen();
    } else if (fullscreenElement.msRequestFullscreen) { /* IE/Edge */
        fullscreenElement.msRequestFullscreen();
    }

}

function drawBackground() {
    count++;
    document.getElementById("count").value = count;
}

function move() {

}

function drawMovingObjects() {

}