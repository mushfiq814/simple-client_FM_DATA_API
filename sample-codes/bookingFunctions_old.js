// GLOBAL VARIABLES FOR THE WHOLE DOCUMENT
var _globalPageStateDay = 0;
var _globalJsonCategoryData = "";
var _globalJsonSubjectData = "";
var _globalJsonAppointmentData = "";
var _globalJsonTutorAvailabilityData = "";
var _globalDayValue = "";
var _globalJsonTutorGoogleTokensData = "";
var _globalNumOfDaysCreated = 0;

var testAvailableTimeArray = [];
var testSelectedTutorId = "";
var testSelectedDateString = _globalDayValue;
var testSelectedDate = "";
var testSelectedDay = "";
var testSelectedDuration = 1;

// TODO: Fix the layout name changes for Get Subjects, Get Tutors, Get Availability

var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var monthArray = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

const apiUrl = "http://localhost:8000";
// const apiUrl = "http://api.disciplinedmindstutoring.com";
// const apiLocalUrl = "http://localhost:8000";

// onload starting function
window.onload = function() {
  // cache the DOM
  var categoryList = document.getElementById("categoryList");
  var subjectList = document.getElementById("subjectList");
  var tutorList = document.getElementById("tutorList");
  var timeList = document.getElementById("timeList");
  var durationList = document.getElementById("durationList");
  var nameField = document.getElementById("nameField");
  var emailField = document.getElementById("emailField");
  var phoneField = document.getElementById("phoneField");
  var submitBtn = document.getElementById("submitBtn");
  var dayItem = document.getElementsByClassName("day-item");

  // generate the day-item elements with dates starting from today
  drawCalendarWeek(0);
  // add Event Listeners
  submitBtn.addEventListener("click", create, false);
  categoryList.addEventListener("change", () => {
    categoryList.value === "none"
      ? (subjectList.innerHTML = "")
      : updateSubjectDropDown();
  });
  subjectList.addEventListener("change", () => {
    subjectList.value === "none"
      ? (tutorList.innerHTML = "")
      : updateTutorDropDown();
  });
  tutorList.addEventListener("change", () => {
    tutorList.value === "none"
      ? (timeList.innerHTML = "")
      : updateTimeDropDown();
  });

  durationList.addEventListener("change", () => {
    console.log("Hello");
    sortAvailabilityArray();
  });

  // iteratively add Event Listeners to each day-item element on click
  for (var i = 0; i < dayItem.length; i++) {
    dayItem[i].addEventListener("click", event => {
      var eventTarget = event.target; // the clicked element
      var eventTargetParent = event.target.parentElement; // the parent of the clicked element
      var eventTargetParentClass = event.target.parentElement.className; // class for the parent of the clicked element

      if (eventTargetParentClass == "day-item") {
        // if the inside dates or months were clicked
        // get info from the parent element which is the 'day-item' element
        var date = eventTargetParent.getElementsByClassName("date-view")[0]
          .innerHTML;
        var monthYear = eventTargetParent.getElementsByClassName(
          "month-view"
        )[0].innerHTML;
        var changeColorElement = eventTargetParent;
      } else if (eventTargetParentClass == "calendar-week-view") {
        // if the day-item element was clicked
        // get info from that element since it is the 'day-item' element
        var date = eventTarget.getElementsByClassName("date-view")[0].innerHTML;
        var monthYear = eventTarget.getElementsByClassName("month-view")[0]
          .innerHTML;
        var changeColorElement = eventTarget;
      }

      // change the background color to show selected
      // TODO drawCalendarWeek needs to generate infinite list of days for selection purposes
      var dayItem = document.getElementsByClassName("day-item");
      for (var j = 0; j < dayItem.length; j++) {
        dayItem[j].style.backgroundColor = "#2c7fb4";
      }
      changeColorElement.style.backgroundColor = "#555555";

      // set the date inside the element to the global variable so it is known accross the document
      _globalDayValue = formatDate(new Date(date + " " + monthYear));
      console.log(_globalDayValue);

      // update the Time dropdown to reflect the changed date
      updateTimeDropDown();
    });
  }

  getSubjects();
  getTutors();
  // getAppointments();
  // getTutorAvailability();
  // getTutorGoogleTokens();
};

/**
 * fill up dates and day for Calendar View
 * @param {int} delta increment for finding dates from current date
 */
function drawCalendarWeek(delta) {
  var tempDate = new Date();
  var startDate = new Date(
    tempDate.getTime() + (_globalPageStateDay + delta) * 24 * 3600000
  ); // startDate depends on the increment passed in

  if (delta == 1) _globalPageStateDay++;
  // next Day
  else if (delta == -1) _globalPageStateDay--; // previous Day

  // arrays for lookup days and months

  var dayItem = document.getElementsByClassName("day-item");
  // TODO: Fix setTimeout()
  // NOTE: setTimeout is used here since the day-items are not created on page load and a 0 second delay has to be used
  setTimeout(() => {
    for (k = 0; k < dayItem.length; k++) {
      tempDate = new Date(startDate);
      tempDate.setDate(tempDate.getDate() + k);
      var month = document.getElementsByClassName("month-view");
      var date = document.getElementsByClassName("date-view");
      var day = document.getElementsByClassName("day-view");
      month[k].innerHTML =
        monthArray[tempDate.getMonth()] + " " + tempDate.getFullYear();
      date[k].innerHTML = tempDate.getDate();
      day[k].innerHTML = dayArray[tempDate.getDay()];
    }
  }, 0);
}

// app variables. Required for Middleware API
app = {
  project: "DM_FM17_API",
  environment: "DEV-LOCAL",
  version: "v1.0.0"
};

/**
 * creates a new FileMaker record using Data API
 * @param {event} event submit button click event
 * TODO: Need to add functionaliy for creating a new student record. Then, retrieve the ID and put that as the StudentID in the appointment
 */
function create(event) {
  event.preventDefault();

  // create new FormData
  var formData;
  formData = new FormData();
  // set desired values to be sent into http body
  formData.append(
    "subject",
    subjectList.options[subjectList.selectedIndex].innerHTML
  );
  formData.append(
    "tutor",
    tutorList.options[tutorList.selectedIndex].innerHTML
  );
  formData.append("date", _globalDayValue);
  formData.append("time", timeList.options[timeList.selectedIndex].innerHTML);
  formData.append("name", nameField.value);
  formData.append("email", emailField.value);
  formData.append("phoneNumber", phoneField.value);

  // POST request
  fetch(apiUrl + "/create", {
    method: "POST",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    body: formData,
    cache: "no-cache"
  }).then(() => {
    console.log("Request Complete...");
  });
}

/**
 * Get Subject Categories with subjects
 * TODO: Fix formatting of JSON since Categories don't have a separate table 
 * and they are not grouped in a tree with their subjects anymore
 */
function getSubjects() {
  console.log("Connecting to FileMaker");
  fetch(apiUrl + "/getSubjectsFromCategories", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var data = myJson.results.record.response.data;
      for (var i = 0; i < data.length; i++) {
        if (data[i].fieldData.ShowOnWebsite == "Yes") {
          var category = data[i].fieldData.CategoryName;
          var categoryId = data[i].fieldData.CategoryID;
          var opt = document.createElement("option");
          opt.value = categoryId;
          opt.innerHTML = category;
          categoryList.appendChild(opt);
        }
      }
      _globalJsonCategoryData = data;
    })
    .then(() => {
      console.log("Successfully got Category & Subject List!");
    });
}

/**
 * Get subjects with tutors
 */
function getTutors() {
  fetch(apiUrl + "/getTutorsFromSubjects", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var data = myJson.results.record.response.data;
      for (var i = 0; i < data.length; i++) {
        var subject = data[i].fieldData.Subjects;
        var selectedCategory =
          categoryList.options[categoryList.selectedIndex].innerHTML;

        if (subject == selectedCategory) {
          var opt = document.createElement("option");
          opt.value = "subject" + (i + 1);
          opt.innerHTML = subject;
          subjectList.appendChild(opt);
        }
      }
      _globalJsonSubjectData = data;
    })
    .then(() => {
      console.log("Successfully got Subject & Tutor List!");
    });
}

/**
 * Get appointments with times
 */
function getAppointments() {
  fetch(apiUrl + "/getAppointments/400", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var data = myJson.results.record.response.data;

      data.sort((a, b) => {
        if (a.fieldData.DateTimeConcat < b.fieldData.DateTimeConcat) return -1;
        if (a.fieldData.DateTimeConcat > b.fieldData.DateTimeConcat) return 1;
        else return 0;
      });

      _globalJsonAppointmentData = data;
    })
    .then(() => {
      console.log("Successfully got all appointments!");
    });
}

/**
 * Get Tutor Start and End Times
 */
function getTutorAvailability() {
  fetch(apiUrl + "/getTutorAvailability", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var data = myJson.results.record.response.data;
      _globalJsonTutorAvailabilityData = data;
    })
    .then(() => {
      console.log("Successfully got Tutor Availabilities!");
    });
}

/**
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
function updateSubjectDropDown() {
  var selectedCategoryId =
    categoryList.options[categoryList.selectedIndex].value;

  for (var i=0; i<_globalJsonCategoryData.length; i++) {
    if (_globalJsonCategoryData[i].fieldData.CategoryID == selectedCategoryId) {
      var subjects = _globalJsonCategoryData[i].portalData.WEB_Subjects_forCategoriesWithSubjectPortals;
      break;
    }
  }
  
  // TODO: Create variables for layout names such as SubjectToTutors.
  subjectList.innerHTML = "";
  for (var j = 0; j < subjects.length; j++) {
    if (subjects[j]["WEB_Subjects_forCategoriesWithSubjectPortals::ShowOnWebsite"] == "Yes") {
      var subject = subjects[j]["WEB_Subjects_forCategoriesWithSubjectPortals::Subject Name"];
      var opt = document.createElement("option");
      opt.value = subjects[j]["WEB_Subjects_forCategoriesWithSubjectPortals::ID_subject"];
      opt.innerHTML = subject;
      subjectList.appendChild(opt);
    }
  }
}

/**
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
function updateTutorDropDown() {
  var selectedSubjectId =
    subjectList.options[subjectList.selectedIndex].value;

  for (var i = 0; i < _globalJsonSubjectData.length; i++) {
    if (_globalJsonSubjectData[i].fieldData.ID_subject == selectedSubjectId) {
      var tutors = _globalJsonSubjectData[i].portalData.WEB_Subjects_Tutor;
      break;
    }
  }

  // TODO: Create variables for layout names such as SubjectToTutors.
  tutorList.innerHTML = "";
  for (var j = 0; j < tutors.length; j++) {
    var tutor = tutors[j]["WEB_Subjects_Tutor::Tutor_Name"];
    var opt = document.createElement("option");
    opt.value = tutors[j]["WEB_Subjects_Tutor::id_tutor"];
    opt.innerHTML = tutor;
    tutorList.appendChild(opt);
  }
}

/**
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
function updateTimeDropDown() {
  var selectedTutor = tutorList.options[tutorList.selectedIndex].innerHTML;
  var selectedDate = _globalDayValue;
  var selectedDayIndex = new Date(selectedDate).getDay(); // gets the index of the day seleced. e.g. 0=>Sunday, 1=>Monday, etc.
  var appointmentStartTimes = [];
  var tutorStartEndTimes = calculateAvailability(selectedTutor);


  // NEW STUFF

  testSelectedTutorId = tutorList.options[tutorList.selectedIndex].value;
  testSelectedDateString = _globalDayValue;
  testSelectedDate = new Date(testSelectedDateString);
  testSelectedDay = dayArray[testSelectedDate.getDay()];
  testSelectedDuration = 1;

  console.log(`
  testSelectedTutorId: ${testSelectedTutorId},
  testSelectedDateString: ${testSelectedDateString},
  testSelectedDate: ${testSelectedDate},
  testSelectedDay: ${testSelectedDay},
  testSelectedDuration: ${testSelectedDuration}
  `);

  getTutorStartAndEndTimes();
  getAppointmentsForTheDay();

  // END NEW STUFF

  // console.log("start and end Times for " + selectedTutor);
  // console.log(tutorStartEndTimes);

  // // push start Time to calculation
  // appointmentStartTimes.push(["", tutorStartEndTimes[selectedDayIndex].start]);
  // // push appointment Times in the middle
  // for (var i = 0; i < _globalJsonAppointmentData.length; i++) {
  //   if (
  //     _globalJsonAppointmentData[i].fieldData.Tutor == selectedTutor &&
  //     _globalJsonAppointmentData[i].fieldData.Date == selectedDate
  //   ) {
  //     appointmentStartTimes.push([
  //       _globalJsonAppointmentData[i].fieldData.StartTime,
  //       _globalJsonAppointmentData[i].fieldData.EndTime
  //     ]);
  //   }
  // }
  // // push end Time to calculation
  // appointmentStartTimes.push([tutorStartEndTimes[selectedDayIndex].end, ""]);

  // console.log("Appointment Times:");
  // console.log(appointmentStartTimes);
  // var availableTimes = findAvailabilities(appointmentStartTimes);

  // timeList.innerHTML = "";
  // for (var j = 0; j < availableTimes.length; j++) {
  //   var opt = document.createElement("option");
  //   opt.value = "time" + (j + 1);
  //   opt.innerHTML = availableTimes[j];
  //   timeList.appendChild(opt);
  // }
}

/**
 * calculation for finding the selected Tutor's availability
 */
function calculateAvailability(tutor) {
  var availabilityArray = [];

  for (var i = 0; i < _globalJsonTutorAvailabilityData.length; i++) {
    if (_globalJsonTutorAvailabilityData[i].fieldData.Tutors == tutor) {
      for (var j = 0; j < 7; j++) {
        var startTimeFieldName = "day" + (j + 1) + "_startTime";
        var endTimeFieldName = "day" + (j + 1) + "_endTime";

        availabilityArray.push({
          slot: j,
          day: dayArray[j],
          start:
            _globalJsonTutorAvailabilityData[i].fieldData[startTimeFieldName],
          end: _globalJsonTutorAvailabilityData[i].fieldData[endTimeFieldName]
        });
      }
    }
  }

  return availabilityArray;
}

/**
 * Calculates 1 hour long availabilities between appointments provided
 * @param {array} timeArray Array with appointment start times
 * @returns array of availabilities
 * TODO: Find a way to include start time as start of day and end time as end of day
 * TODO: Find a way to accomodate multiple durations
 */
function findAvailabilities(timeArray) {
  var availableTimes = [];
  if (timeArray[0][1] !== "") {
    for (i = 0; i < timeArray.length - 1; i++) {
      var end = new Date("01/04/2019 " + timeArray[i][1]);
      var nxtStart = new Date("01/04/2019 " + timeArray[i + 1][0]);
      var numberOfApps = (nxtStart.getTime() - end.getTime()) / 3600000;
      var bookingIntervals = 1; // inetrval in hours for which booking times are displayed

      for (j = 0; j < numberOfApps; j++) {
        var time =
          end.getTime() / (3600000 * bookingIntervals) + j * bookingIntervals;
        var formattedTime = formatTime(time);
        availableTimes.push(formattedTime);
      }
    }
  }

  return availableTimes;
}

/**
 * formats the time given in total hours into hh:mm:ss
 * @param {*} hours to format
 * TODO: Need to take into account 15 min appointments as well. e.g. 9:15-10:15 so availability shouldn't start at 8:30.
 */
function formatTime(hours) {
  var timeZoneOffset = -5;
  var calculatedHourValue = (hours % 24) + timeZoneOffset;
  var hourInDecimal =
    calculatedHourValue < 0 ? 24 + calculatedHourValue : calculatedHourValue;
  var hour = Math.floor(hourInDecimal);
  var minute = (hourInDecimal % 1) * 60;

  // var hourString = hour<10 ? '0'+hour : hour;
  // var minuteString = minute<10 ? '0'+minute : minute;
  var hourString = hour > 12 ? hour - 12 : hour;
  var minuteString = minute < 10 ? "0" + minute : minute;
  var ampm = hour >= 12 ? "pm" : "am";

  return `${hourString}:${minuteString} ${ampm}`;
}

/**
 * formats the date given into MM/dd/yyyy format
 * @param {date} date date object to be formatted in MM/dd/yyyy
 */
function formatDate(date) {
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var yea = date.getFullYear();
  mon = mon < 10 ? "0" + mon : mon; // add leading zeros
  day = day < 10 ? "0" + day : day;
  return mon + "/" + day + "/" + yea;
}

/**
 * Connect to Tutotr Google Calendar, get refresh token, request access token and find conflicts for that day
 */
function getTutorGoogleTokens() {
  fetch(apiUrl + "/getTutorGoogleTokens", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      var data = myJson.results.record.response.data;
      _globalJsonTutorGoogleTokensData = data;
      getTutorConflicts();
    })
    .then(() => {
      console.log("Successfully got Tutor Google Tokens");
    })
    .catch(err => console.log(err));
}

/**
 *
 */
function getTutorConflicts() {
  _globalJsonTutorGoogleTokensData.forEach(tutor => {
    let selectedTutor = tutorList.options[tutorList.selectedIndex].innerHTML;
    let selectedDate = _globalDayValue;

    if (selectedTutor == tutor.fieldData["TutorName_TutorInfo"]) {
      console.log(`
        ${tutor.fieldData["TutorName_TutorInfo"]}
        ${tutor.fieldData["client ID"]}
        ${tutor.fieldData["client secret"]}
        ${tutor.fieldData["code"]}
        ${tutor.fieldData["access token"]}
        ${tutor.fieldData["refresh token"]}
        ${tutor.fieldData["calendar ID"]} 
      `);
    }
  });
}


// TIME CALCULATION SCRIPTS

function sortAvailabilityArray() {
  console.log(testAvailableTimeArray.length)
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
    console.log(_globalJsonSelectedTutorBlockData);
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
  console.log("Available Times:");
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