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
var playerHeight = 25;
var enemies = [];
var enemyWidth = 40;
var enemyHeight = 40;
var gameSpeed = 10;
var hitsElement;
var hits = 0;
var newEnemy = 0;
var horizontalOrientation;
var spaceship;
var planet;
var start;
var timeSinceStart;
var highScore = 0;
var barHeight = 20;
var enemyProducingSpeed = 50;
var currentEnemyProducingSpeed = enemyProducingSpeed;

const manageGame = function () {
    if (newEnemy > currentEnemyProducingSpeed) {
        enemies.push(createEnemy());
        newEnemy = 0;
        currentEnemyProducingSpeed = enemyProducingSpeed-(timeSinceStart/20);
    }
    newEnemy++;
    drawBackground();
    move();
    drawMovingObjects();
    drawStatusBar();
}

//wird beim Start ausgeführt
window.onload = function () {

    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation

    screen.lockOrientationUniversal("landscape-primary");

    start = Date.now();
    setInterval(function () {
        timeSinceStart = Math.floor((Date.now() - start) / 1000);
    }, 1);

    spaceship = new Image();
    spaceship.src = '../ressources/images/spaceship_20x10px.png';
    planet = new Image();
    planet.src = '../ressources/images/planet20px.png';

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
    gameCanvas.width = 720;
    gameCanvas.height = 400;

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
        //gameCanvas.width = window.innerWidth;
        //gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.mozRequestFullScreen) { /* Firefox */
        fullscreenElement.mozRequestFullScreen();
        //gameCanvas.width = window.innerWidth;
        //gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        fullscreenElement.webkitRequestFullscreen();
        //gameCanvas.width = window.innerWidth;
        //gameCanvas.height = window.innerHeight;
    } else if (fullscreenElement.msRequestFullscreen) { /* IE/Edge */
        fullscreenElement.msRequestFullscreen();
        //gameCanvas.width = window.innerWidth;
        //gameCanvas.height = window.innerHeight;
    }
}



function exitFullscreen() {
    /*
    if (gameCanvas.width == window.innerWidth) {
        gameCanvas.width = window.innerWidth / 2;
        gameCanvas.height = window.innerHeight / 2;
    }
    */
}

function drawBackground() {
    gameCanvasContext.fillStyle = "grey";
    gameCanvasContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
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
    if (playerY < barHeight) {
        playerY = barHeight;
    }
}

function drawMovingObjects() {
    drawPlayerObject(playerX, playerY, playerWidth, playerHeight);
    drawEnemies();
}

function drawPlayerObject(x, y, width, height) {
    gameCanvasContext.drawImage(spaceship, x, y, width, height);
    //gameCanvasContext.fillStyle = "white";
    //gameCanvasContext.fillRect(x, y, width, height);
}

function drawEnemyObject(x, y, width, height) {
    gameCanvasContext.drawImage(planet, x, y, width, height);
    //gameCanvasContext.fillStyle = "white";
    //gameCanvasContext.fillRect(x, y, width, height);
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
    enemy.push((Math.random() * (gameCanvas.height - enemyHeight - barHeight))+barHeight);
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
            collisionDetected(count);
        }
        count++;
    })
}

function collisionDetected(enemyId) {
    hits++;
    hitsElement.innerHTML = hits;
    window.navigator.vibrate(300);
    if (timeSinceStart > highScore) {
        highScore = timeSinceStart;
    }
    start = Date.now();
    enemies = [];
}

function startListeningToDeviceOrientation() {
    window.addEventListener('deviceorientation', orientationHandler);
}

const orientationHandler = function (event) {
    getOrienttion(event);
};

function getOrienttion(event) {
    var horizontalOrientation = event.gamma;
    if (horizontalOrientation > 5) {
        direction = 1;
    } else if (horizontalOrientation < -5) {
        direction = -1
    } else {
        direction = 0;
    }
}

function drawStatusBar() {
    gameCanvasContext.fillStyle = "black";
    gameCanvasContext.fillRect(0, 0, gameCanvas.width, barHeight);
    gameCanvasContext.fillStyle = "white";
    gameCanvasContext.font = "10px Arial";
    gameCanvasContext.fillText("Round " + hits, 20, 15);
    gameCanvasContext.fillText("Time: " + timeSinceStart, gameCanvas.width - 50, 15);
    gameCanvasContext.fillText("Highscore: " + highScore, gameCanvas.width / 2 - 50, 15);

}