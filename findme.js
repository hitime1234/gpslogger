var holdPing = 0;
var run = false
var i =0;


function submitGPS(long,lat,time){
  var GPSREADING = {
    longitude: long,
    latitude: lat,
    ping: time,
    id: i
  }
  i = i + 1;
  AddGps(GPSREADING);
}


function AddGps(gpsReading){
  localStorage.setItem(i,JSON.stringify(gpsReading));
  RequestAPI(i,JSON.stringify(gpsReading));
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
    navigator.geolocation.allow;
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

function output(pos){
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
  const x = document.getElementById("demo");
  x.innerHTML = "allow / starting";
  document.getElementById("run").remove()
  run =true;
  //test()
}



function test(){  
  if (run){
    pingURL("ury.org.uk");
    locationize();
  }
}

function RequestAPI(id,json){

  fetch("http://archbtw:8000/data/" + id +"/"+ json,{mode: "no-cors"})
}



function RequestAPIDUMP(json){
  fetch("http://archbtw:8000/data/" + json,{mode: "no-cors"})
}




function dumper(){
  var myStringer = allStorage();
  console.log(myStringer);
  myStringer.forEach(function (item, index) {
    RequestAPI(index+1,item);
  });
  storeCurr();
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
  fetch("http://127.0.0.1:8000/STORE",{mode: "no-cors"})
}


function allStorage() {



  var archive = [],
      keys = Object.keys(localStorage),
      i = 0, key;
  
  var keyers = StrTOnumArray(keys);
  keyers.sort();
  console.log(keyers);
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



var myInterval = setInterval(test, 2000);
