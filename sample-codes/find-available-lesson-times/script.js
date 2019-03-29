// app variables. Required for Middleware API
app = {
  project: "DM_FM17_API",
  environment: "DEV-LOCAL",
  version: "v1.0.0"
};

var dayArray = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

// var testDate = "2019-03-05T01:00:00-00:00";
var testSelectedTutorId = "T01";
var testSelectedDateString = "03/05/2019";
var testSelectedDate = new Date(testSelectedDateString);
var testSelectedDay = dayArray[testSelectedDate.getDay()];
var testSelectedDuration = 1;

var testAvailableTimeArray = [];

var updateBtn = document.getElementById('update-btn');
var selectDropDown = document.getElementById('select');

window.onload = function () {
  updateBtn.addEventListener('click', () => sortAvailabilityArray());

  console.log("Connecting to FileMaker Data API");
  getTutorStartAndEndTimes();
  getAppointmentsForTheDay();
}

function sortAvailabilityArray() {
  for (var i=0; i<testAvailableTimeArray.length; i++) {
    // TODO: Temp fix for not recalculating a date object; check whether there could stuff that breaks this fix
    testAvailableTimeArray[i][0] = (typeof(testAvailableTimeArray[i][0]) == "object") ? testAvailableTimeArray[i][0] : new Date(testSelectedDateString + " " + testAvailableTimeArray[i][0]);
    testAvailableTimeArray[i][1] = (typeof(testAvailableTimeArray[i][1]) == "object") ? testAvailableTimeArray[i][1] : new Date(testSelectedDateString + " " + testAvailableTimeArray[i][1]);
  }
  testAvailableTimeArray.sort((a,b)=> {return a[0]-b[0]});
  
  // remove overlapping times
  for (var j=1; j<testAvailableTimeArray.length; j++) {
    // check whether a block start and end time falls completely within the previous one 
    if (testAvailableTimeArray[j][0]>=testAvailableTimeArray[j-1][0] && testAvailableTimeArray[j][1]<=testAvailableTimeArray[j-1][1]) {
      // if so, delete the redundant slot
      testAvailableTimeArray.splice(j,1);
    }
    // check whether just a block start time falls within the previous one 
    if (testAvailableTimeArray[j][0]>testAvailableTimeArray[j-1][0] && testAvailableTimeArray[j][0]<testAvailableTimeArray[j-1][1]) {
      // if so, extend the previous end time to incorporate the current end time
      testAvailableTimeArray[j-1][1] = testAvailableTimeArray[j][1];
      // and delete the current slot
      testAvailableTimeArray.splice(j,1);
    }
    // check whether a block start time is equal to the previous end time
    // if (testAvailableTimeArray[j][0].getTime()==testAvailableTimeArray[j-1][1].getTime()) {
    //   // if so, extend the previous end time to incorporate the current end time
    //   testAvailableTimeArray[j-1][1] = testAvailableTimeArray[j][1];
    //   // and delete the current slot
    //   testAvailableTimeArray.splice(j,1);
    // }
  }  
  console.log(testAvailableTimeArray);

  findAvailableTimes(testAvailableTimeArray);
}

function getTutorStartAndEndTimes() {
  return fetch("http://localhost:8000/getTutorAvailability", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(res => res.json())
    .then(myJson => _globalJsonTutorAvailabilityData = myJson.results.record.response.data)
    .then(() => console.log("Successfully got Tutor Availabilities!"))
    .then(() => {
      // TODO: Implement getting times for other locations
      // TODO: Implement non-avaialable times that are represneted by empty spaces now
      for (var i=0; i<_globalJsonTutorAvailabilityData.length; i++) {
        if (_globalJsonTutorAvailabilityData[i].fieldData["TutorID_pk_TutorInformation"] == testSelectedTutorId) {
          testAvailableTimeArray.push(["00:00:00", _globalJsonTutorAvailabilityData[i].fieldData[testSelectedDay + "Start_Tutor"]]);
          testAvailableTimeArray.push([_globalJsonTutorAvailabilityData[i].fieldData[testSelectedDay + "End_Tutor"],"23:59:59"]);
          break;
        }
      }
      getTutorBlockTimes();
    })
    .catch(e => console.log(e));
}

function getAppointmentsForTheDay() {
  return fetch("http://localhost:8000/findAppointments/" + convertNormalDateToAPIFindDateFormat(testSelectedDateString), {
    method: "POST",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(res => res.json())
    .then(
      myJson =>
        (_globalJsonCurrentAppointmentsData =
          myJson.results.record.response.data)
    )
    .then(() => console.log("Successfully got Today's Appointments!"))
    .then(() => {
      // TODO: make the search for lessons by tutor more efficient
      for (var i = 0; i < _globalJsonCurrentAppointmentsData.length; i++) {
        if (_globalJsonCurrentAppointmentsData[i].fieldData.id_tutor == testSelectedTutorId) {
          testAvailableTimeArray.push([
            _globalJsonCurrentAppointmentsData[i].fieldData.Start_Time,
            _globalJsonCurrentAppointmentsData[i].fieldData.End_Time
          ]);
        }
      }
    })
    .catch(e => console.log(e));
}

function getTutorBlockTimes() {
  for (var i = 0; i < _globalJsonTutorAvailabilityData.length; i++) {
    if (_globalJsonTutorAvailabilityData[i].fieldData["TutorID_pk_TutorInformation"] == testSelectedTutorId) {
      var refreshToken = _globalJsonTutorAvailabilityData[i].fieldData["refresh token"];
      var clientId = _globalJsonTutorAvailabilityData[i].fieldData["client ID"];
      var clientSecret = _globalJsonTutorAvailabilityData[i].fieldData["client secret"];
      var calendarId = _globalJsonTutorAvailabilityData[i].fieldData["calendar ID"];
      break;
    }
  }

  refreshTutorAccessToken(clientId, clientSecret, refreshToken, calendarId);
}

function refreshTutorAccessToken(clientId, clientSecret, refreshToken, calendarId) {
  return fetch(`https://www.googleapis.com/oauth2/v4/token?client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}&grant_type=refresh_token`,{
    method: "POST",
    cache: "no-cache"
  })
    .then(res => res.json())
    .then(myJson => {
      var accessToken = myJson.access_token;
      var timeMax = convertNormalDateToGDate(testSelectedDateString) + "T23:59:59-05:00";
      var timeMin = convertNormalDateToGDate(testSelectedDateString) + "T00:00:00-05:00";
      getTutorEventsForTheDay(calendarId, accessToken, timeMax, timeMin);
    })
}

function getTutorEventsForTheDay(calendarId, accessToken, timeMax, timeMin) {
  return fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?access_token=${accessToken}&timeMax=${timeMax}&timeMin=${timeMin}`, {
    method: "GET",
    cache: "no-cache"
  })
  .then(res => res.json())
  .then(myJson => _globalJsonSelectedTutorBlockData = myJson.items)
  .then(() => {
    for (var i=0; i<_globalJsonSelectedTutorBlockData.length; i++) {
      // Todo: Implement for All-Day Blocks as well
      testAvailableTimeArray.push([
        convertGTimeToNormalTime(_globalJsonSelectedTutorBlockData[i].start.dateTime),
        convertGTimeToNormalTime(_globalJsonSelectedTutorBlockData[i].end.dateTime)
      ])
    }
  })
}

function findAvailableTimes(array) {
  for (var i=0; i<array.length-1; i++) {
    var duration = testSelectedDuration*3600000;
    var numberOfAvails = Math.floor((array[i+1][0]-array[i][1]-duration+3600000)/3600000);
    
    for (var j=0; j<numberOfAvails; j++) {
      // TODO: currently only appointments on the hour are allowed. Look into this! If change is necessary, change the j*3600000
      var startTime = convertFullDateObjToTime(new Date(+array[i][1]+ j*3600000));
      var endTime = convertFullDateObjToTime(new Date(+array[i][1]+ j*3600000 + duration));
      console.log(`${startTime} to ${endTime}`);
    }
  }
}

/* SUPPLEMENTARY FUNCTIONS */

/**
 * Convert time in YYYY-MM-DDTHH:MM:SS TIMEZONE format to HH:mm:SS MM/DD/YYYY
 * @param {*} timeInGFormat time in YYYY-MM-DDTHH:MM:SS TIMEZONE format
 */
function convertGDateToNormalDate(dateInGFormat) {
  var timeZoneOffset = -5;

  var year = dateInGFormat.substring(0,4);
  var month = dateInGFormat.substring(5,7);
  var day = dateInGFormat.substring(8,10);
  var hour = dateInGFormat.substring(11,13);
  var minute = dateInGFormat.substring(14,16);
  var second = dateInGFormat.substring(17,19);

  var returnDate = new Date(timeZoneOffset*3600000 + new Date(`${hour}:${minute}:${second} ${month}/${day}/${year}`).getTime());

  return returnDate;
}

/**
 * Convert time in YYYY-MM-DDTHH:MM:SS TIMEZONE format to HH:mm:SS
 * @param {*} timeInGFormat time in YYYY-MM-DDTHH:MM:SS TIMEZONE format
 */
function convertGTimeToNormalTime(timeInGFormat) {
  var timeZoneOffset = -5;

  var year = timeInGFormat.substring(0,4);
  var month = timeInGFormat.substring(5,7);
  var day = timeInGFormat.substring(8,10);
  var hour = timeInGFormat.substring(11,13);
  var minute = timeInGFormat.substring(14,16);
  var second = timeInGFormat.substring(17,19);

  var returnDateTimestamp = new Date(timeZoneOffset*3600000 + new Date(`${hour}:${minute}:${second} ${month}/${day}/${year}`).getTime());
  var returnTime = `${returnDateTimestamp.getHours()}:${returnDateTimestamp.getMinutes()}:${returnDateTimestamp.getSeconds()}`
  return returnTime;
}

function convertFullDateObjToTime(fullDateObj) {
  var hour = fullDateObj.getHours().toString();
  hour = hour.length < 2 ? "0" + hour : hour;
  var minute = fullDateObj.getMinutes().toString();
  minute = minute.length < 2 ? "0" + minute : minute;
  var second = fullDateObj.getSeconds().toString();
  second = second.length < 2 ? "0" + second : second;

  var returnTime = `${hour}:${minute}:${second}`;
  return returnTime;
}

/**
 * Convert date in MM/DD/YYYY to YYYY-MM-DD
 * @param {*} dateInNormalFormat date in MM/DD/YYYY
 */
function convertNormalDateToGDate(dateInNormalFormat) {
  var date = new Date(dateInNormalFormat);
  var formattedYear = date.getFullYear();
  var formattedMonth = (date.getMonth()+1).toString().length<2 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
  var formattedDate = date.getDate().toString().length<2 ? "0" + date.getDate() : date.getDate();
  var formattedFullDate = formattedYear +"-"+ formattedMonth +"-"+ formattedDate;
  return formattedFullDate;
}

/**
 * Convert date in MM/DD/YYYY to MM-DD-YYYY for the findLessons API format
 * @param {*} dateInNormalFormat date in MM/DD/YYYY
 */
function convertNormalDateToAPIFindDateFormat(dateInNormalFormat) {
  var date = new Date(dateInNormalFormat);
  var formattedYear = date.getFullYear();
  var formattedMonth = (date.getMonth()+1).toString().length<2 ? "0" + (date.getMonth()+1) : (date.getMonth()+1);
  var formattedDate = date.getDate().toString().length<2 ? "0" + date.getDate() : date.getDate();
  var formattedFullDate = formattedMonth +"-"+ formattedDate +"-"+ formattedYear;
  return formattedFullDate;
}