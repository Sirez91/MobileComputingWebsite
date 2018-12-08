const fps = 60;
var count = 0;
var fullscreenElement;
var gameCanvas;
var gameCanvasContext;
var playerX = 20;
var playerY = 50;
var playerSpeed = 5;
var actualPlayerSpeed;
var direction = 0;
var playerWidth = 50;
var playerHeight = 50;
var enemies = [];
var enemyWidth = 50;
var enemyHeight = 50;
var gameSpeed = 10;
var hitsElement;
var hits = 0;
var newEnemy = 0;
var horizontalOrientation;

const manageGame = function () {
    if (newEnemy > 50) {
        enemies.push(createEnemy());
        newEnemy = 0;
    }
    newEnemy++;
    drawBackground();
    move();
    drawMovingObjects();
}

//wird beim Start ausgeführt
window.onload = function () {

    startListeningToDeviceOrientation();

    actualPlayerSpeed = playerSpeed;
    setOnFullScreenChange();

    window.onkeydown = checkKey;
    window.onkeyup = function () {
        direction = 0;
    }
    fullscreenElement = document.getElementById("gameCanvas");
    gameCanvas = document.getElementById("gameCanvas");
    hitsElement = document.getElementById("hits");
    hitsElement.innerHTML = hits;
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
    gameCanvasContext.fillStyle = "black";
    gameCanvasContext.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function move() {
    movePlayer();
    moveEnemies();
}

function movePlayer() {
    playerY = playerY + actualPlayerSpeed * direction;
    if (playerY > gameCanvas.height - playerHeight) {
        playerY = gameCanvas.height - playerHeight;
    }
    if (playerY < 0) {
        playerY = 0;
    }
}

function drawMovingObjects() {
    drawPlayerObject(playerX, playerY, playerWidth, playerHeight);
    drawEnemies();
}

function drawPlayerObject(x, y, width, height) {
    gameCanvasContext.fillStyle = "white";
    gameCanvasContext.fillRect(x, y, width, height);
}

function drawEnemyObject(x, y, width, height) {
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


function createEnemy() {
    var enemy = [];
    enemy.push(gameCanvas.width);
    enemy.push((Math.random() * (gameCanvas.height - enemyHeight)));
    enemy.push(enemyWidth);
    enemy.push(enemyHeight);
    return enemy;
}

function moveEnemies() {
    var count = 0;
    enemies.forEach(function (enemy) {
        if (enemy[0] > 0) {
            enemy[0] = enemy[0] - gameSpeed;
        } else {
            enemies[count] = {};
        }
        count++;

    })
}

function drawEnemies() {
    count = 0;
    enemies.forEach(function (enemy) {
        drawEnemyObject(enemy[0], enemy[1], enemy[2], enemy[3]);
        if (enemy[0] < playerX + playerWidth && playerY - enemyHeight < enemy[1] && enemy[1] < playerY + playerHeight) {
            //alert("enemy x: " + enemy[0] + " player x: " + playerX + " enemy y: " + enemy[1] + " player y :" + playerY);
            hits++;
            hitsElement.innerHTML = hits;
            enemies[count] = {};
        }
        count++;
    })
}

function startListeningToDeviceOrientation() {
    window.addEventListener('deviceorientation', orientationHandler);
}

const orientationHandler = function (event) {
    getOrienttion(event);
};

function getOrienttion(event) {
    var horizontalOrientation = event.gamma;
    alert("funktioniert");
    if (horizontalOrientation > 5) {
        direction = 1;
    } else if (horizontalOrientation < 5) {
        direction = -1
    } else {
        direction = 0;
    }
}