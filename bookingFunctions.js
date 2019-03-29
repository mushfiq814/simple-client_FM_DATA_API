// GLOBAL VARIABLES FOR THE WHOLE DOCUMENT
var _globalPageStateDay = 0;
var _globalJsonCategoryData = "";
var _globalJsonSubjectData = "";
var _globalDayValue = "";
var _globalNumOfDaysCreated = 0;

// TODO: Fix the layout name changes for Get Subjects, Get Tutors, Get Availability

var dayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
  dateList.addEventListener("change", () => {
    let dt = new Date(dateList.value);
    _globalDayValue = formatDate(dt, 'MMDDYYYY');
    console.log(_globalDayValue);
    updateTimeDropDown();
  });

  // existing customer radio
  // let selectedExistingCustomerOpt = document.querySelector('input[name = "existingCustomerRadio"]:checked') ? document.querySelector('input[name = "existingCustomerRadio"]:checked').value : '';
  // console.log(selectedExistingCustomerOpt);

  getSubjects();
  getTutors();
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

  // create new FormData
  var formData;
  formData = new FormData();
  // set desired values to be sent into http body
  formData.append(
    "subjectID",
    subjectList.options[subjectList.selectedIndex].value
  );
  formData.append(
    "tutorID",
    tutorList.options[tutorList.selectedIndex].value
  );
  formData.append("date", _globalDayValue);
  formData.append("start", timeList.options[timeList.selectedIndex].innerHTML);
  formData.append("student", studentNameField.value);
  formData.append("duration", durationList.options[durationList.selectedIndex].innerHTML);

  let additionalInfoText = `Existing Customer: #N/A
  Student Email: ${studentEmailField.value}
  Student Phone: ${studentPhoneField.value}
  Parent Name: ${parentNameField.value}
  Parent Email: ${parentEmailField.value}
  Parent Phone: ${parentPhoneField.value}`;
  additionalInfoText = additionalInfoText.replace(/[ \t\f\v]/g, '');
  formData.append("additionalInfo",additionalInfoText);
  

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
    window.targe
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
function updateTutorDropDown() {
  var selectedSubjectId = subjectList.options[subjectList.selectedIndex].value;

  for (var i = 0; i < _globalJsonSubjectData.length; i++) {
    if (_globalJsonSubjectData[i].fieldData.ID_subject == selectedSubjectId) {
      var tutors = _globalJsonSubjectData[i].portalData.WEB_Subjects_Tutor;
      break;
    }
  }

  // TODO: Create variables for layout names such as SubjectToTutors.
  tutorList.innerHTML = "";
  var opt = document.createElement("option");
  opt.innerHTML = "Choose a tutor";
  tutorList.appendChild(opt);
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
  var selectedTutorId = tutorList.options[tutorList.selectedIndex].value;
  var selectedDate = _globalDayValue;
  var availableTimes = [];

  console.log(`${selectedDate}-${selectedTutorId}-ST`);

  fetch(apiUrl + `/getTutorAvailability/${selectedDate}-${selectedTutorId}-WC`, {
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
      var availableTimes = myJson.results.record.response.data;
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

}

/**
 * calculate Availability based on selected Duration
 * @param {array} arrayOfAvailableTimes array containing available start and end timestamps
 */
function calculateAvailableTimes(arrayOfAvailableTimes) {
  let selectedDuration = durationList.options[durationList.selectedIndex].value;
  let result = [];
  
  
  // check for when there are no available times
  if (arrayOfAvailableTimes[0].fieldData.ExampleText == "Tutor Not Available") {
    result.push(["Not Available"]);
  } else {
    for (var i=0; i<arrayOfAvailableTimes.length; i++) {
      let startTime = new Date (arrayOfAvailableTimes[i].fieldData.StartTimestamp);
      let endTime = new Date (arrayOfAvailableTimes[i].fieldData.EndTimestamp);
      let defaultGap = 1;
      
      let numOfLessons = ( ( ( (endTime-startTime) % (24*3600000) ) / 3600000 - selectedDuration ) / defaultGap ) + 1;
      console.log(`Available: ${startTime} to ${endTime}. Fits ${numOfLessons} lessons ${selectedDuration} hour each`);
      
      for (let j=0; j<numOfLessons; j++) {
        let calculatedStart = new Date(startTime.getTime() + j*defaultGap*3600000);
        result.push(formatDate(calculatedStart,'HMM AMPM'));
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