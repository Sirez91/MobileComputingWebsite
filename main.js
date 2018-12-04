var xAcceleration;
var yAcceleration;
var zAcceleration;

function startListeningToDeviceMotion() {
    window.addEventListener('devicemotion', function(event) {
        getAcceleration(event);
        writeAccelerationToDocument();
    });
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