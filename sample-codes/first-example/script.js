var nm = document.getElementById('nm');
var em = document.getElementById('em');
var rid = document.getElementById('rid');
var postBtn = document.getElementById('btnPost');
var getOneBtn = document.getElementById('btnGetOne');
var getAllBtn = document.getElementById('btnGetAll');

app = {
  project: 'FM17_REST_DEMO',
  environment: 'DEV-LOCAL',
  version: 'v1.0.0'
};

create = function(event) {
  event.preventDefault();
  
  var formData;
  formData = new FormData();
  formData.append("name", nm.value);
  formData.append("email", em.value);
  formData.append("phoneNumber", nm.value);
  formData.append("subject", nm.value);
  formData.append("tutor", nm.value);
  formData.append("date", nm.value);
  formData.append("time", nm.value);

  fetch('http://localhost:8000/create', {
    method: 'POST',
    headers: new Headers(
      [
        ['X-RCC-PROJECT', app.project], 
        ['X-RCC-ENVIRONMENT', app.environment], 
        ['X-RCC-VERSION', app.version]
      ]
    ),
    body: formData,
    cache: 'no-cache'
  }).then(function(response) {
    return window.location = './thanks.html';
  });
}

getOne = function(event) {
  event.preventDefault();
  var recordId = rid.value;
  var p;
  p = fetch('http://localhost:8000/retrieveOne/'+recordId, {
    method: 'GET',
    headers: new Headers(
      [
        ['X-RCC-PROJECT', app.project], 
        ['X-RCC-ENVIRONMENT', app.environment], 
        ['X-RCC-VERSION', app.version]
      ]
    ),
    cache: 'no-cache'
  }).then(function(response) {
    return response.json();
  }).then(function(myJson) {
    var data = myJson.results.record.response.data;
    for (var i=0; i<data.length; i++) {
      console.log("name: " + data[i].fieldData.Name);
      console.log("email: " + data[i].fieldData.Email);
    }
  });
}

getAll = function(event) {
  event.preventDefault();
  var p;
  p = fetch('http://localhost:8000/retrieveAll', {
    method: 'GET',
    headers: new Headers(
      [
        ['X-RCC-PROJECT', app.project], 
        ['X-RCC-ENVIRONMENT', app.environment], 
        ['X-RCC-VERSION', app.version]
      ]
    ),
    cache: 'no-cache'
  }).then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    var data = myJson.results.records.response.data;
    for (var i=0; i<data.length; i++) {
      console.log("name: " + data[i].fieldData.Name);
      console.log("email: " + data[i].fieldData.Email);
      console.log("phone: " + data[i].fieldData.PhoneNumber);
      console.log("subject: " + data[i].fieldData.Subject);
      console.log("tutor: " + data[i].fieldData.Tutor);
      console.log("date: " + data[i].fieldData.Date);
      console.log("time: " + data[i].fieldData.Time);
      console.log("----------------------------------");
    }
  });
}

window.onload = function() {
  postBtn.addEventListener('click', create, false);
  getOneBtn.addEventListener('click', getOne, false);
  getAllBtn.addEventListener('click', getAll, false);
}