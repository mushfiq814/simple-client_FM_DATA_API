// GLOBAL VARIABLES FOR THE WHOLE DOCUMENT
var _globalPageStateDay = 0;
var _globalJsonCategoryData = "";
var _globalJsonSubjectData = "";
var _globalDayValue = "";
var _globalNumOfDaysCreated = 0;

// TODO: Fix the layout name changes for Get Subjects, Get Tutors, Get Availability

var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var overlay = document.getElementsByClassName("toggle");

// const apiUrl = "http://localhost:8000";
const apiUrl = "https://api.disciplinedmindstutoring.com";

// onload starting function
window.onload = async function() {
  // cache the DOM
  var categoryList = document.getElementById("categoryList");
  var subjectList = document.getElementById("subjectList");
  var tutorList = document.getElementById("tutorList");
  var timeList = document.getElementById("timeList");
  var durationList = document.getElementById("durationList");

  var studentNameField = document.getElementById("studentNameField");
  var studentEmailField = document.getElementById("studentEmailField");
  var studentPhoneField = document.getElementById("studentPhoneField");
  var parentNameField = document.getElementById("parentNameField");
  var parentEmailField = document.getElementById("parentEmailField");
  var parentPhoneField = document.getElementById("parentPhoneField");

  var submitBtn = document.getElementById("submitBtn");
  var dayItem = document.getElementsByClassName("day-item");
  
  var dateList = document.getElementById("datepicker");

  // generate the day-item elements with dates starting from today
  // drawCalendarWeek(0);

  // start by disabling the pikaday calendar datepicker
  dateList.disabled = true;

  // add Event Listeners
  submitBtn.addEventListener("click", create, false);

  categoryList.addEventListener("change", () => {
    subjectList.disabled = false;
    categoryList.value === "none"
      ? (subjectList.innerHTML = "")
      : updateSubjectDropDown();
  });
  subjectList.addEventListener("change", () => {
    dateList.disabled = false;
    if (_globalDayValue != "") {
      // tutorList.disabled = false;
      subjectList.value === "none"
        ? (tutorList.innerHTML = "")
        : updateTutorDropDown();
    }
  });
  dateList.addEventListener("change", () => {
    tutorList.disabled = false;
    durationList.disabled = false;
    let dt = new Date(dateList.value);
    _globalDayValue = formatDate(dt, 'MMDDYYYY');
    updateTutorDropDown();
  });
  durationList.addEventListener("change", () => {
    updateTimeDropDown();   
  });
  tutorList.addEventListener("change", () => {
    timeList.disabled = false;
    tutorList.value === "none"
      ? (timeList.innerHTML = "")
      : updateTimeDropDown();
  });

  // existing customer radio
  // console.log(selectedExistingCustomerOpt);

  document.getElementById("toggle").style.display = "block";
  await getSubjects();
  await getTutors();
  document.getElementById("toggle").style.display = "none";
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

  // DYNAMICALLY GENERATE DAY ITEMS

  var calendarWeekViewContainer = document.getElementById('calendarWeekView');
  for (l=0; l<60; l++) {
    document.createElement('div');
  }


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
  
  // get all data
  let subjectId = subjectList.options[subjectList.selectedIndex].value;
  let tutorId = tutorList.options[tutorList.selectedIndex].value;
  let start = timeList.options[timeList.selectedIndex].innerHTML;
  let duration = durationList.options[durationList.selectedIndex].innerHTML;
  
  let studentName = studentNameField.value;
  let studentEmail = studentEmailField.value;
  let studentPhone = studentPhoneField.value;
  let parentName = parentNameField.value;
  let parentEmail = parentEmailField.value;
  let parentPhone = parentPhoneField.value;

  // Validation
  let subjectInvalid = subjectId === "" || subjectId === null || subjectId == "Choose a subject" || subjectId == "none"; // console.log("Empty subject field");
  let tutorInvalid = tutorId === "" || tutorId === null || tutorId == "Choose a tutor" || tutorId == "none"; // console.log("Empty tutor field");
  let startInvalid = start === "" || start === null || start == "1" || start == "none"; // console.log("Empty time field");
  let dateInvalid = _globalDayValue === "" || _globalDayValue === null || _globalDayValue == "none"; // console.log("Empty date field");
  let studentNameInvalid = studentName === "" || studentName === null || studentName == "none"; // console.log("Empty student Name field");
  let studentEmailInvalid = studentEmail.match(/.+@.*\..*/g) === null || studentEmail === "" || studentEmail === null || studentEmail == "none"; // console.log("Empty student Email field");
  
  // the invalid variable is true when the data entered is not valid
  
  let invalid = subjectInvalid || tutorInvalid || startInvalid || dateInvalid || studentNameInvalid || studentEmailInvalid;

  if (!invalid) {      
    // create new FormData
    var formData;
    formData = new FormData();
    // set desired values to be sent into http body
    formData.append("subjectID", subjectId);
    formData.append("tutorID", tutorId);
    formData.append("date", _globalDayValue);
    formData.append("start", start);
    formData.append("student", studentName);
    formData.append("duration", duration);
    formData.append("location", "South Tampa");

    formData.append("studentEmail", studentEmail);
    formData.append("studentPhone", studentPhone);
    formData.append("parentName", parentName);
    formData.append("parentEmail", parentEmail);
    formData.append("parentPhone", parentPhone);
    formData.append("existingCustomer", document.querySelector('input[name = "existingCustomerRadio"]:checked') ? document.querySelector('input[name = "existingCustomerRadio"]:checked').value : '');

    formData.append("scriptName", "Create_Online_Booked_Lesson_in_FM_Lessons");
    formData.append("scriptParam", "N/A");

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
      window.location.href = 'https://disciplinedmindstutoring.com/appointment-created';
    });
  } else {
    let msg = "";

    if (subjectInvalid) msg = "Please select a subject.";
    else if (tutorInvalid) msg = "Please select a tutor.";
    else if (startInvalid) msg = "Please select a time.";
    else if (dateInvalid) msg = "Please select a date from the calendar.";
    else if (studentNameInvalid) msg = "Please enter the name of the student.";
    else if (studentEmailInvalid) msg = "Please enter an email.";
    
    alert(msg);
  }
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
        var subject = data[i].fieldData["Subject Name"];
        var selectedCategory = categoryList.options[categoryList.selectedIndex].innerHTML;
        
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
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
function updateSubjectDropDown() {
  var selectedCategoryId =
    categoryList.options[categoryList.selectedIndex].value;

  for (var i = 0; i < _globalJsonCategoryData.length; i++) {
    if (_globalJsonCategoryData[i].fieldData.CategoryID == selectedCategoryId) {
      var subjects =
        _globalJsonCategoryData[i].portalData
          .WEB_Subjects_forCategoriesWithSubjectPortals;
      break;
    }
  }

  // TODO: Create variables for layout names such as SubjectToTutors.
  subjectList.innerHTML = "";
  var opt = document.createElement("option");
  opt.innerHTML = "Choose a subject";
  subjectList.appendChild(opt);
  tutorList.innerHTML = "";
  var opt = document.createElement("option");
  opt.innerHTML = "Choose a tutor";
  tutorList.appendChild(opt);
  for (var j = 0; j < subjects.length; j++) {
    if (
      subjects[j][
        "WEB_Subjects_forCategoriesWithSubjectPortals::ShowOnWebsite"
      ] == "Yes"
    ) {
      var subject =
        subjects[j][
          "WEB_Subjects_forCategoriesWithSubjectPortals::Subject Name"
        ];
      var opt = document.createElement("option");
      opt.value =
        subjects[j]["WEB_Subjects_forCategoriesWithSubjectPortals::ID_subject"];
      opt.innerHTML = subject;
      subjectList.appendChild(opt);
    }
  }
}

/**
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
async function updateTutorDropDown() {
  var selectedSubjectId = subjectList.options[subjectList.selectedIndex].value;

  for (var i = 0; i < _globalJsonSubjectData.length; i++) {
    if (_globalJsonSubjectData[i].fieldData.ID_subject == selectedSubjectId) {
      var tutors = _globalJsonSubjectData[i].portalData.Subjects_Tutor;
      break;
    }
  }

  tutorList.innerHTML = "";
  var opt = document.createElement("option");
  opt.innerHTML = "Choose a tutor";
  tutorList.appendChild(opt);

  console.log("TUTORS LOADING...");
  document.getElementById("toggle").style.display = "block";

  for (var k=0; k<tutors.length; k++) {
    var tutorId = tutors[k]["Subjects_Tutor::id_tutor"];
    var tutorName = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::TutorName_TutorInfo"];
    var tutorCateogry = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::Tutor Category"];
    var tutorShowOnWebsite = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::ShowOnWebsite"];
    var date = _globalDayValue;
    if (tutorCateogry!= "HWK-SPOT" || tutorShowOnWebsite === "Yes") await getTutorAvailabilityThroughFM(tutorId, date, tutorName);  
  }
  
  console.log("TUTOR LOADING DONE");
  document.getElementById("toggle").style.display = "none";
  // overlay[0].style.display = "none";
  // overlay[1].style.display = "none";
}

async function getTutorAvailabilityThroughFM(tutorId, date, tutorName) {
  // see if all the found tutors are avaialble through FM script
  var availableTimes = [];

  await fetch(apiUrl + `/getTutorAvailability/${date}-${tutorId}-ST`, {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
    .then(response => response.json())
    .then(myJson => {
      var availableTimes = myJson.results.record.response.data;
      var calculatedTimes = calculateAvailableTimes(availableTimes);
      console.log("FOR: " + tutorName + "; " + availableTimes[0].fieldData.ExampleText + "; " + calculatedTimes[0]);
      if (availableTimes[0].fieldData.ExampleText == "Tutor Not Available" || calculatedTimes[0]=="Not Available") {
        console.log("FAILED " + tutorName);
      } else {
        console.log("PASSED " + tutorName);
        var opt = document.createElement("option");
        opt.value = tutorId
        opt.innerHTML = tutorName;
        tutorList.appendChild(opt);
      }
    })
    .catch(e => console.log(e));
}

/**
 * Updates select tags with relevant option tags.
 * Should be called whenever higher order select field is changed
 */
async function updateTimeDropDown() {
  var selectedTutorId = tutorList.options[tutorList.selectedIndex].value;
  var selectedDate = _globalDayValue;
  var availableTimes = [];

  document.getElementById("toggle").style.display = "block";

  await fetch(apiUrl + `/getTutorAvailability/${selectedDate}-${selectedTutorId}-ST`, {
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
      let availableTimes = myJson.results.record.response.data;
      let startTimes = calculateAvailableTimes(availableTimes);
      
      timeList.innerHTML = "";
      for (var j = 0; j < startTimes.length; j++) {
        var opt = document.createElement("option");
        opt.value = "time" + (j + 1);
        opt.innerHTML = `${startTimes[j]}`;
        // opt.innerHTML = `${availableTimes[j].fieldData.StartTimestamp} to ${availableTimes[j].fieldData.EndTimestamp}`;
        timeList.appendChild(opt);
      }
    })
    .catch(e => console.log(e));
  
  document.getElementById("toggle").style.display = "none";

}

/**
 * calculate Availability based on selected Duration
 * @param {array} arrayOfAvailableTimes array containing available start and end timestamps
 */
function calculateAvailableTimes(arrayOfAvailableTimes) {
  let selectedDuration = durationList.options[durationList.selectedIndex].value;
  let result = [];

  let allowedBookingTimeframe = 4;
  let allowedTime = new Date(new Date().getTime() + allowedBookingTimeframe*3600000);
  
  // check for when there are no available times
  if (arrayOfAvailableTimes[0].fieldData.ExampleText == "Tutor Not Available") {
    result.push(["Not Available"]);
  } else {
    for (var i=0; i<arrayOfAvailableTimes.length; i++) {
      let startTime = new Date (arrayOfAvailableTimes[i].fieldData.StartTimestamp);
      let endTime = new Date (arrayOfAvailableTimes[i].fieldData.EndTimestamp);
      let defaultGap = 1;

      // figure out whether any times are within the non allowed booking timeframe
      if (!(allowedTime >= endTime)) {
        if (allowedTime > startTime && allowedTime < endTime) startTime = allowedTime; // startTime should be modified to allowedTime
        
        let numOfLessons = Math.floor( ( ( ( (endTime-startTime) % (24*3600000) ) / 3600000 - selectedDuration ) / defaultGap ) + 1 );
        
        if (numOfLessons==0 || numOfLessons==null || Number.isNaN(numOfLessons)) {
          result.push(["Not Available"]);
        }
        else {
          for (let j=0; j<numOfLessons; j++) {
            let calculatedStart = new Date(startTime.getTime() + j*defaultGap*3600000);
            result.push(formatDate(calculatedStart,'HMM AMPM'));
          }
        }
      }

    }
  }

  return result;
}

/**
 * formats the date given into MM/dd/yyyy format
 * @param {date} date date object to be formatted in MM/dd/yyyy
 */
function formatDate(date, option) {
  if (option == 'MMDDYYYY') {
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var yea = date.getFullYear();
    mon = mon < 10 ? "0" + mon : mon; // add leading zeros
    day = day < 10 ? "0" + day : day;
    return mon + "-" + day + "-" + yea;
  } else if (option == 'HMM AMPM') {
    var hr = date.getHours();
    var min = date.getMinutes();
    var ampm = hr > 11 ? 'pm' : 'am';
    if (hr==0) hr=12;
    else hr = hr > 12 ? (hr-12) : hr;
    min = min < 10 ? "0" + min : min; // add leading zeros
    return hr + ":" + min + " " + ampm;
  }
}

function showLoadingScreen() {
  document.getElementsByClassName("underneath")[0].style.opacity = 0.2;

  let loadingScreen = document.createElement("div");
  loadingScreen.classList.add("loading");
  loadingScreen.style.zIndex = 1000;
  loadingScreen.style.position = "fixed";
  loadingScreen.style.height = "100%";
  loadingScreen.style.width = "100%";

  let loaderText = document.createElement('p');
  loaderText.classList.add('loader-text');
  loaderText.innerText = "Loading...";
  let loaderIcon = document.createElement('div');
  loaderIcon.classList.add('loader');

  loadingScreen.appendChild(loaderText);
  loadingScreen.appendChild(loaderIcon);

  let mainPageElement = document.getElementsByClassName("entry-content")[0];
  let mainPageChild = document.getElementsByClassName("et_pb_section_0 ")[0];
  mainPageElement.insertBefore(loadingScreen, mainPageChild);  
}

function hideLoadingScreen() {
  document.getElementsByClassName("underneath")[0].style.opacity = 1.0;

  let loadingScreen = document.getElementsByClassName("loading")[0];
  document.getElementsByClassName("entry-content")[0].removeChild(loadingScreen);
}