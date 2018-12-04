var xAcceleration;
var yAcceleration;
var zAcceleration;
var xOrientattion;
var yOrientattion;
var zOrientattion;
var lumen;

const motionHandler =  function(event) {
    getAcceleration(event);
    writeAccelerationToDocument();
};

const orientationHandler = function(event) {
    getOrienttion(event);
    writeOrientationToDocument();
};

const lightHandler = function(event) {
    getLight(event);
    writeLightToDocument();
};

//Beschleunigung

function startListeningToDeviceMotion() {
    window.addEventListener('devicemotion', motionHandler);
}

function getAcceleration(event) {
    xAcceleration = event.acceleration.x;
    yAcceleration = event.acceleration.y;
    zAcceleration = event.acceleration.z;
}

function writeAccelerationToDocument() {
    document.getElementById("xAcceleration").innerHTML = xAcceleration;
    document.getElementById("yAcceleration").innerHTML = yAcceleration;
    document.getElementById("zAcceleration").innerHTML = zAcceleration;
}

function stopListeningToDeviceMotion() {
    window.removeEventListener('devicemotion', motionHandler);
}

//Orientierung

function startListeningToDeviceOrientation() {
    window.addEventListener('deviceorientation', orientationHandler);
}

function getOrienttion(event) {
    xOrientattion = event.alpha;
    yOrientattion = event.beta;
    zOrientattion = event.gamma;
}

function writeOrientationToDocument() {
    document.getElementById("xOrientattion").innerHTML = xOrientattion;
    document.getElementById("yOrientattion").innerHTML = yOrientattion;
    document.getElementById("zOrientattion").innerHTML = zOrientattion;
}

function stopListeningToDeviceOrientation() {
    window.removeEventListener('deviceorientation', orientationHandler);
}

//Umgebungslicht

function startListeningToDeviceLight() {
    window.addEventListener('devicelight', lightHandler);
}

function getLight(event) {
    lumen = event.value;
}

function writeLightToDocument() {
    document.getElementById("lumen").innerHTML = lumen;
}

function stopListeningToDeviceLight() {
    window.removeEventListener('devicelight', lightHandler);
}