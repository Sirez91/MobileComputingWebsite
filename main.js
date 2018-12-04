var xAcceleration;
var yAcceleration;
var zAcceleration;

const func =  function(event) {
    getAcceleration(event);
    writeAccelerationToDocument();
};

function startListeningToDeviceMotion() {
    window.addEventListener('devicemotion', func);
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
    console.log("trying to remove devicemotion listener");
    window.removeEventListener('devicemotion', func);
    console.log("success?");

}