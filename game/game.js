const fps = 60;
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
var tries = 0;
var newEnemy = 0;
var horizontalOrientation;
var spaceship;
var planet;
var heart;
var startTime;
var timeSinceStart;
var highScore = 0;
var barHeight = 20;
var enemyProducingSpeed = 50;
var currentEnemyProducingSpeed = enemyProducingSpeed;
var paused = true;
var extra = null;
var extraTiming;
var extraLifes = 0;
var pauseTime = null;

const manageGame = function() {
  if (!paused) {
    runGame();
  } else { 
    if(enemies != []) {
      if(pauseTime!=null) {
        drawGamePaused();
      }
    }    
  }
};

//wird beim Start ausgeführt
window.onload = function() {
  jQuery(document).ready(function() {
    /*
        Navigation
    */
    $("a.scroll-link").on("click", function(e) {
      e.preventDefault();
      scroll_to($(this), $("nav").outerHeight());
    });
  });

  setValues();
  setInterval(function() {
    timeSinceStart = Math.floor((Date.now() - startTime) / 1000);
  }, 1);

  loadImages();

  startListeningToDeviceOrientation();

  setOnFullScreenChange();

  window.onkeydown = checkKey;
  window.onkeyup = function() {
    direction = 0;
  };
  setInterval(manageGame, 1000 / fps);
};

function runGame() {
  if (newEnemy > currentEnemyProducingSpeed) {
    enemies.push(createEnemy());
    newEnemy = 0;
    currentEnemyProducingSpeed = enemyProducingSpeed - timeSinceStart / 2;
  }
  newEnemy++;
  move();
  drawEverything();
}

function drawEverything() {
  drawBackground();
  drawStatusBar();
  drawMovingObjects();
}

function loadImages() {
  spaceship = new Image();
  spaceship.src = "../ressources/images/spaceship_20x10px.png";
  planet = new Image();
  planet.src = "../ressources/images/planet20px.png";
  heart = new Image();
  heart.src = "../ressources/images/herz_20px.png";
}

function setValues() {
  startTime = Date.now();
  actualPlayerSpeed = playerSpeed;
  fullscreenElement = document.getElementById("gameCanvas");
  gameCanvas = document.getElementById("gameCanvas");
  gameCanvasContext = gameCanvas.getContext("2d");
  gameCanvas.width = 0;
  gameCanvas.height = 0;
  extraTiming = Math.floor(Math.random() * 60);
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
  startListeningToDeviceMotion();
  gameCanvas.width = 720;
  gameCanvas.height = 400;

  if(pauseTime==null) {
    drawGameStart();
  }

  if (fullscreenElement.requestFullscreen) {
    fullscreenElement.requestFullscreen();
  } else if (fullscreenElement.mozRequestFullScreen) {
    /* Firefox */
    fullscreenElement.mozRequestFullScreen();
  } else if (fullscreenElement.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    fullscreenElement.webkitRequestFullscreen();
  } else if (fullscreenElement.msRequestFullscreen) {
    /* IE/Edge */
    fullscreenElement.msRequestFullscreen();
  }
  screen.orientation.lock("landscape-primary");
}

function exitFullscreen() {
  paused = true;
  pauseTime = Date.now();
  gameCanvas.width = 0;
  gameCanvas.height = 0;
  stopListeningToDeviceMotion();
}

function drawBackground() {
  gameCanvasContext.fillStyle = "grey";
  gameCanvasContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function move() {
  movePlayer();
  moveEnemies();
  moveExtra();
}

function moveExtra() {
  if (extra != null) {
    if (extra[0] > 0) {
      extra[0] = extra[0] - gameSpeed;
    } else {
      extraTiming = extraTiming + Math.floor(Math.random() * 60);
      extra = null;
    }
  }
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
  drawExtra();
  drawEnemies();
}

function drawExtra() {
  if (extra != null) {
    drawExtraLife(extra[0], extra[1], 20, 20);
    if (
      extra[0] < playerX + playerWidth &&
      playerY - 20 < extra[1] &&
      extra[1] < playerY + playerHeight
    ) {
      extraLifes++;
      extra = null;
      extraTiming = extraTiming + Math.floor(Math.random() * 60);
    }
  } else if (timeSinceStart > extraTiming) {
    extra = [
      gameCanvas.width,
      Math.floor(
        Math.random() * (gameCanvas.height - enemyHeight - barHeight) +
          barHeight
      )
    ];
  }
}

function drawPlayerObject(x, y, width, height) {
  gameCanvasContext.drawImage(spaceship, x, y, width, height);
}

function drawEnemyObject(x, y, width, height) {
  gameCanvasContext.drawImage(planet, x, y, width, height);
}

function checkKey(e) {
  e = e || window.event;

  if (e.keyCode == "38") {
    actualPlayerSpeed = playerSpeed;
    direction = -1;
  } else if (e.keyCode == "40") {
    actualPlayerSpeed = playerSpeed;
    direction = 1;
  } else if (e.keyCode == "18") {
    if (paused == true) {
      if (pauseTime == null) {
        startTime = Date.now();
      } else {
        startTime = startTime + (Date.now() - pauseTime);
      }
      pauseTime = null;
      paused = false;
    } else {
      pauseTime = Date.now();
      paused = true;
    }
  }
}

function onFullScreenChange() {
  let fullScreenElement =
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
  enemy.push(
    Math.random() * (gameCanvas.height - enemyHeight - barHeight) + barHeight
  );
  enemy.push(enemyWidth);
  enemy.push(enemyHeight);
  return enemy;
}

function moveEnemies() {
  let count = 0;
  enemies.forEach(function(enemy) {
    if (enemy[0] > 0) {
      enemy[0] = enemy[0] - gameSpeed;
    } else {
      enemies[count] = {};
    }
    count++;
  });
}

function drawEnemies() {
  let count = 0;
  enemies.forEach(function(enemy) {
    drawEnemyObject(enemy[0], enemy[1], enemy[2], enemy[3]);
    if (
      enemy[0] < playerX + playerWidth &&
      playerY - enemyHeight < enemy[1] &&
      enemy[1] < playerY + playerHeight
    ) {
      collisionDetected(count);
    }
    count++;
  });
}

function collisionDetected(enemyId) {
  tries++;
  window.navigator.vibrate(300);
  if (extraLifes > 0) {
    extraLifes--;
    enemies.splice(enemyId, 1);
  } else {
    drawGameOver();
    paused = true;
    enemies = [];
    extra = null;
    extraTiming = Math.floor(Math.random() * 60);
  }
}

function startListeningToDeviceOrientation() {
  window.addEventListener("deviceorientation", orientationHandler);
}

const orientationHandler = function(event) {
  getOrienttion(event);
};

function getOrienttion(event) {
  let horizontalOrientation = event.gamma;
  if (horizontalOrientation > 4) {
    direction = -1;
  } else if (horizontalOrientation < -4) {
    direction = 1;
  } else {
    direction = 0;
  }
}

function drawStatusBar() {
  gameCanvasContext.fillStyle = "black";
  gameCanvasContext.fillRect(0, 0, gameCanvas.width, barHeight);
  gameCanvasContext.fillStyle = "white";
  gameCanvasContext.font = "10pt Arial";
  gameCanvasContext.fillText("Tries " + tries, 20, 15);
  gameCanvasContext.fillText(
    "Time: " + timeSinceStart,
    gameCanvas.width - 70,
    15
  );
  gameCanvasContext.fillText(
    "Highscore: " + highScore,
    gameCanvas.width / 2 - 50,
    15
  );
  drawExtraLife(100, 5, 10, 10);
  gameCanvasContext.fillText(String(extraLifes), 115, 15);
}

function drawExtraLife(x, y, width, height) {
  gameCanvasContext.drawImage(heart, x, y, width, height);
}

function scroll_to(clicked_link, nav_height) {
  var element_class = clicked_link.attr("href");
  var scroll_to = 0;
  if (element_class != ".game") {
    scroll_to = $(element_class).offset().top - 100;
  }
  if ($(window).scrollTop() != scroll_to) {
    $("html, body")
      .stop()
      .animate({ scrollTop: scroll_to }, 1000);
  }
}

function drawGameOver() {
  gameCanvasContext.fillStyle = "lightgrey";
  gameCanvasContext.font = "100px Arial";
  gameCanvasContext.fillText("GAME OVER", 50, gameCanvas.height / 2 - 50);
  gameCanvasContext.font = "20px Arial";
  gameCanvasContext.fillText(
    timeSinceStart + " SEKUNDEN ÜBERLEBT",
    250,
    gameCanvas.height / 2
  );
  if (timeSinceStart > highScore) {
    gameCanvasContext.font = "50px Arial";
    gameCanvasContext.fillText(
      "NEUER HIGHSCORE",
      100,
      gameCanvas.height / 2 + 75
    );
    highScore = timeSinceStart;
  }
  drawActionToPlay();
}

function drawGamePaused() {
  gameCanvasContext.fillStyle = "lightgrey";
  gameCanvasContext.font = "100px Arial";
  gameCanvasContext.fillText("PAUSIERT", 120, gameCanvas.height / 2);
  drawActionToPlay();
}

function drawActionToPlay() {
  gameCanvasContext.font = "20px Arial";
  if (horizontalOrientation != null) {
    gameCanvasContext.fillText(
      "Schütteln zum Spielen",
      250,
      gameCanvas.height / 2 + 150
    );
  } else {
    gameCanvasContext.fillText(
      "Drücke Alt zum Spielen",
      250,
      gameCanvas.height / 2 + 150
    );
  }
}

function drawGameStart() {
  gameCanvasContext.fillStyle = "lightgrey";
  gameCanvasContext.font = "100px Arial";
  gameCanvasContext.fillText("BEREIT?", 150, gameCanvas.height / 2);
  drawActionToPlay();
}

function startListeningToDeviceMotion() {
  window.addEventListener("devicemotion", motionHandler);
}

function stopListeningToDeviceMotion() {
  window.removeEventListener("devicemotion", motionHandler);
}

const motionHandler = function(event) {
  x = event.acceleration.x;
  y = event.acceleration.y;
  z = event.acceleration.z;
  if(x > 6 || y > 6 || z > 6) {
    if (paused == true) {
      if (pauseTime == null) {
        startTime = Date.now();
      } else {
        startTime = startTime + (Date.now() - pauseTime);
      }
      pauseTime = null;
      paused = false;
    } else {
      pauseTime = Date.now();
      paused = true;
    }
  }
};