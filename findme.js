var holdPing = 0;
var run = false;
var i =0;
var HOSTDOM = "127.0.0.1:8000";
var StartingLat = 0;
var StartingLong = 0;
var CurLat = 0;
var CurLong = 0;
var first = true;
var startTime = 0;



function submitGPS(long,lat,time){
  
  var GPSREADING = {
    longitude: long,
    latitude: lat,
    ping: time,
    id: i,
    time: (Date.now() - startTime)
  }
  i = i + 1;
  AddGps(GPSREADING);
}


function AddGps(gpsReading){
  localStorage.setItem(i,JSON.stringify(gpsReading));
  //RequestAPI(i,JSON.stringify(gpsReading));
}



function calcCrow(lat1, lon1, lat2, lon2) 
{
  var R = 6371; // km
  var dLat = toRad(lat2-lat1);
  var dLon = toRad(lon2-lon1);
  var lat1 = toRad(lat1);
  var lat2 = toRad(lat2);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}



function pingURL(url) { 
  var start = new Date().valueOf();
  
  fetch("https://" +url,{mode: "no-cors"}).then((response) => {
    var end = new Date().valueOf();
    console.log("Online");
    console.log(end-start);
    holdPing=end-start;
  }).catch(e => { console.log("Offline")});
  
}

function locationize(){
  const x = document.getElementById("demo");
  if (navigator.geolocation) {
    //x.innerHTML = "Loading";
    navigator.geolocation.getCurrentPosition(output,showError)
  }
  else{
    x.innerHTML = "Loading error";
    console.log("no lol")
  }
}



function showError(error) {
  const x = document.getElementById("demo");
  switch(error.code) {
    case error.PERMISSION_DENIED:
      x.innerHTML = "User denied the request for Geolocation."
      break;
    case error.POSITION_UNAVAILABLE:
      x.innerHTML = "Location information is unavailable."
      break;
    case error.TIMEOUT:
      x.innerHTML = "The request to get user location timed out."
      break;
    case error.UNKNOWN_ERROR:
      x.innerHTML = "An unknown error occurred."
      break;
  }
} 

function updateSpeed(DisKm){
  var TimeInS = (Date.now() - startTime)/1000;
  var TimeInH = (TimeInS) / (60*60);
  var SpeedInKmH = DisKm / TimeInH;
  const x = document.getElementById("speedMaker");
  x.innerHTML = SpeedInKmH.toString() + " km/h";
}

function updateDistance(){
  const x = document.getElementById("distanceMaker");
  var DistanceInKM = calcCrow(StartingLat,StartingLong,CurLat,CurLong);
  updateSpeed(DistanceInKM);
  x.innerHTML = DistanceInKM.toString() + " km " + "Traveled";
}

function output(pos){
  if (first){
    first = false;
    StartingLat = pos.coords.latitude;
    StartingLong = pos.coords.longitude;
  }
  else{
    CurLat = pos.coords.latitude;
    CurLong = pos.coords.longitude;
    updateDistance()
  }



  hold = holdPing;
  NoMS = hold.toString().replace("ms","");
  console.log(holdPing)
  const x = document.getElementById("demo");
  x.innerHTML = "writting";
  x.innerHTML = hold +
  "ms<br>"+ "Latitude: " + pos.coords.latitude +
  "<br>Longitude: " + pos.coords.longitude; 
  if (NoMS != "0"){
    submitGPS(pos.coords.longitude,pos.coords.latitude,NoMS);
  }
}

function allow(){
  startTime = Date.now()
  const x = document.getElementById("demo");
  x.innerHTML = "allow / starting";
  document.getElementById("run").remove()
  run =true;
  //test()
}




function test(){  
  //forces premission window on some devices
  navigator.geolocation.allow;
  
  if (run){
    locationize();
    pingURL("ury.org.uk");
    
  }
}

function RequestAPI(id,json){

  fetch("http://" + HOSTDOM +"/data/" + id +"/"+ json,{mode: "no-cors"})
}



function RequestAPIDUMP(json){
  fetch("http://"+HOSTDOM+"/data/" + json,{method: "POST",mode: "no-cors"})
}

function POSTAPI(id,json){
  fetch("http://" + HOSTDOM +"/data/" + id +"/"+ json, {
    method: "POST",
    mode: "no-cors",
  })
}


function dumper(){
  var myStringer = allStorage();
  console.log(myStringer);
  myStringer.forEach(function (item, index) {
    POSTAPI(index+1,item);
  });
  //storeCurr();
}



function StrTOnumArray(stringArray){
  let numberArray = [];
 
  // Store length of array of string
  // in letiable length
  length = stringArray.length;
  
  // Iterate through array of string using
  // for loop
  // push all elements of array of string
  // in array of numbers by typecasting
  // them to integers using parseInt function
  for (let i = 0; i < length; i++)
  
      // Instead of parseInt(), Number()
      // can also be used
    numberArray.push(parseInt(stringArray[i]));
  return numberArray;

  
}

function storeCurr(){
  fetch("http://" + HOSTDOM+ "/STORE",{mode: "no-cors"})
}


function allStorage() {
  var archive = [],
      keys = Object.keys(localStorage),
      i = 0, key;
  
  var keyers = StrTOnumArray(keys);
  keyers.sort();
  //console.log(keyers);
  for (; key = keyers[i]; i++) {
      
      archive.push(localStorage.getItem(key.toString()));
  }

  return archive;
}


function everyTime() {
  console.log('each 1 second...');
}

function stopper(){
  if (document.getElementById("run") == null){
    //submitGPS("10","20","100ms");
    x = document.getElementById("content");
    stopButton = document.getElementById("stop");
    newButton = document.createElement('button');
    newButton.addEventListener("click",allow);
    newButton.setAttribute("id","run")
    newButton.textContent = 'findme';
    x.insertBefore(newButton,stopButton)
    xText = document.getElementById("demo");
    xText.innerHTML = "";
    run = false;
    localStorage.clear();
    i = 0;
  }
}

var myInterval = setInterval(test, 3500);
