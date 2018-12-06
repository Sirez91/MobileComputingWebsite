const fps = 30;
var count = 0;
var fullscreenElement;
var gameCanvas;
var gameCanvasContext;
var playerX = 20;
var playerY = 50;
var playerSpeed = 20;
var actualPlayerSpeed;
var direction = 0;
var playerWidth = 50;
var playerHeight = 50;

const manageGame = function () {
    drawBackground();
    move();
    drawMovingObjects();
}

//wird beim Start ausgeführt
window.onload = function () {

    actualPlayerSpeed = playerSpeed;
    setOnFullScreenChange();

    window.onkeydown = checkKey;
    window.onkeyup = function () {
        actualPlayerSpeed = 0;
    }
    fullscreenElement = document.getElementById("gameCanvas");
    gameCanvas = document.getElementById("gameCanvas");
    //window.onresize = exitFullscreen;
    gameCanvasContext = gameCanvas.getContext("2d");
    gameCanvas.width = window.innerWidth / 2;
    gameCanvas.height = window.innerHeight / 2;

    setInterval(manageGame, 1000 / fps);
}

function setOnFullScreenChange() {
    if (document.onfullscreenchange === null)
        document.onfullscreenchange = onFullScreenChange;
    else if (document.onmsfullscreenchange === null)
        document.onmsfullscreenchange = onFullScreenChange;
    else if (document.onmozfullscreenchange === null)
        document.onmozfullscreenchange = onFullScreenChange;
    else if (document.onwebkitfullscreenchange === null)
        document.onwebkitfullscreenchange = onFullScreenChange;
}

//Makes the "fullscreenElement" fill the whole screen
function startFullscreen() {

    if (fullscreenElement.requestFullscreen) {
        fullscreenElement.requestFullscreen();
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.mozRequestFullScreen) { /* Firefox */
        fullscreenElement.mozRequestFullScreen();
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        fullscreenElement.webkitRequestFullscreen();
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.msRequestFullscreen) { /* IE/Edge */
        fullscreenElement.msRequestFullscreen();
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;
    }
}



function exitFullscreen() {
    if (gameCanvas.width == window.innerWidth) {
        gameCanvas.width = window.innerWidth / 2;
        gameCanvas.height = window.innerHeight / 2;
    }
}

function drawBackground() {
    gameCanvasContext.fillStyle = "yellow";
    gameCanvasContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
    document.getElementById("text").innerHTML = window.innerWidth;
}

function move() {
    movePlayer();
}

function movePlayer() {
    playerY = playerY + actualPlayerSpeed * direction;
    if (playerY > gameCanvas.height - playerHeight) {
        playerY = gameCanvas.height-playerHeight;
    }
    if (playerY < 0) {
        playerY = 0;
    }
}

function drawMovingObjects() {
    drawPlayerObject(playerX, playerY, playerWidth, playerHeight);
}

function drawPlayerObject(x, y, width, height) {
    gameCanvasContext.fillStyle = "white";
    gameCanvasContext.fillRect(x, y, width, height);
}

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        actualPlayerSpeed = playerSpeed;
        direction = -1;
    }
    else if (e.keyCode == '40') {
        actualPlayerSpeed = playerSpeed;
        direction = 1;
    }

}

function onFullScreenChange() {
    var fullScreenElement =
        document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
    if (!fullScreenElement) {
        exitFullscreen();
    }
}
