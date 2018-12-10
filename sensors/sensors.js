var xAcceleration;
var yAcceleration;
var zAcceleration;
var xOrientattion;
var yOrientattion;
var zOrientattion;
var lumen;
var latitude;
var longitude;
var geolocationWatchId;
var requestedBluetoothDevice;
var proximity;
var timeOld = 0;
var speed;

const proximityHandler = function(event) {
  getProximity(event);
  writeProximityToDocument();
};

const handleLocation = function(location) {
  if ((Date.now() - timeOld) / 1000 > 2) {
    getGeolocation(location);
    writeGeolocationToDocument();
  }
};

const motionHandler = function(event) {
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
  window.addEventListener("devicemotion", motionHandler);
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
  window.removeEventListener("devicemotion", motionHandler);
}

//Orientierung

function startListeningToDeviceOrientation() {
  window.addEventListener("deviceorientation", orientationHandler);
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
  window.removeEventListener("deviceorientation", orientationHandler);
}

//Umgebungslicht
//Im Firefox Mobile Browser ('about:config') muss device.sensors.ambientLight.enabled auf true gesetzt werden

function startListeningToDeviceLight() {
  window.addEventListener("devicelight", lightHandler);
}

function getLight(event) {
  lumen = event.value;
}

function writeLightToDocument() {
  document.getElementById("lumen").innerHTML = lumen;
}

function stopListeningToDeviceLight() {
  window.removeEventListener("devicelight", lightHandler);
}

//Geolocation

function startListeningToGeolocation() {
  geolocationWatchId = navigator.geolocation.watchPosition(
    handleLocation,
    error => console.log(error),
    {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0,
      distanceFilter: 0
    }
  );
}

function getGeolocation(location) {
  var time = Date.now();
  var R = 6378.137; // Radius of earth in KM
  var dLat =
    (location.coords.latitude * Math.PI) / 180 - (latitude * Math.PI) / 180;
  var dLon =
    (location.coords.longitude * Math.PI) / 180 - (longitude * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((latitude * Math.PI) / 180) *
      Math.cos((location.coords.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  var meters = d * 1000;
  console.log((time - timeOld) / (1000 * 60 * 60));
  speed = meters / 1000 / ((time - timeOld) / (1000 * 60 * 60));
  timeOld = Date.now();

  latitude = location.coords.latitude;
  longitude = location.coords.longitude;
}

function writeGeolocationToDocument() {
  document.getElementById("latitude").innerHTML = latitude;
  document.getElementById("longitude").innerHTML = longitude;
  document.getElementById("speed").innerHTML = speed;
}

function stopListeningToGeolocation() {
  navigator.geolocation.clearWatch(geolocationWatchId);
}

//Bluetooth

function requestBluetoothDevice() {
  navigator.bluetooth
    .requestDevice({
      acceptAllDevices: true
    })
    .then(device => {
      requestedBluetoothDevice = device.name;
    })
    .catch(error => {
      requestedBluetoothDevice = "Error: " + error;
    });

  writeRequestedBluetoothDeviceToDocument();
}

function writeRequestedBluetoothDeviceToDocument() {
  document.getElementById(
    "requestedBluetoothDevice"
  ).innerHTML = requestedBluetoothDevice;
}

// Proximity minvalue = 0, maxvalue = 8. Nothing in between is putted out

function startListeningToDeviceProximity() {
  window.addEventListener("deviceproximity", proximityHandler);
}

function getProximity(event) {
  proximity = event.value;
}

function writeProximityToDocument() {
  document.getElementById("proximity").innerHTML = proximity;
}

function stopListeningToDeviceProximity() {
  window.removeEventListener("deviceproximity", proximityHandler);
}
