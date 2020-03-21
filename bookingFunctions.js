// GLOBAL VARIABLES FOR THE WHOLE DOCUMENT
var _globalPageStateDay = 0;
var _globalJsonCategoryData = "";
var _globalJsonSubjectData = "";
var _globalDayValue = "";
var _globalNumOfDaysCreated = 0;

var overlay = document.getElementsByClassName("toggle");

// const apiUrl = "http://localhost:8000";
const apiUrl = "https://api.disciplinedmindstutoring.com";
let locationStr;
const locationShort;

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

  let websitePathname = window.location.pathname;
  if (websitePathname.match(/st/g)) {
    console.log("South Tampa");
    locationStr = "South Tampa";
    locationShort = "ST";
  }
  else if (websitePathname.match(/wc/g)) {
    console.log("Westchase");
    locationStr = "Westchase";
    locationShort = "WC";
  }
  else if (websitePathname.match(/int/g)) {
    console.log("Online / International");
    locationStr = "Online / International";
    locationShort = "INT";
  }
  else console.log("Nada");

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
  })
  tutorList.addEventListener("change", () => {
    timeList.disabled = false;
    tutorList.value === "none"
      ? (timeList.innerHTML = "")
      : updateTimeDropDown();
  });

  // existing customer radio
  // let selectedExistingCustomerOpt = document.querySelector('input[name = "existingCustomerRadio"]:checked') ? document.querySelector('input[name = "existingCustomerRadio"]:checked').value : '';
  // console.log(selectedExistingCustomerOpt);

  document.getElementById("toggle").style.display = "block";
  await getSubjects();
  await getTutors();
  document.getElementById("toggle").style.display = "none";
};

// app variables. Required for Middleware API
app = {
  project: "DM_FM17_API",
  environment: "DEV-LOCAL",
  version: "v1.0.0"
};

/**
 * creates a new FileMaker record using Data API
 * @param {event} event submit button click event
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
    let formData = new FormData();
    // set desired values to be sent into http body
    formData.append("subjectID", subjectId);
    formData.append("tutorID", tutorId);
    formData.append("date", _globalDayValue);
    formData.append("start", start);
    formData.append("student", studentName);
    formData.append("duration", duration);
    formData.append("location", locationStr);

    formData.append("studentEmail", studentEmail);
    formData.append("studentPhone", studentPhone);
    formData.append("parentName", parentName);
    formData.append("parentEmail", parentEmail);
    formData.append("parentPhone", parentPhone);
    formData.append("existingCustomer", document.querySelector('input[name = "existingCustomerRadio"]:checked') ? document.querySelector('input[name = "existingCustomerRadio"]:checked').value : '');

    formData.append("scriptName", "Validate Online Booking and Create Lesson ( bookingId )");

    let bookingId = rand4()+rand4()+rand4()+rand4();
    formData.append("scriptParam", bookingId);

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
      window.location.href = 'https://disciplinedmindstutoring.com/appointment-created/?location=' + locationShort.toLowerCase();
    });
  } else {
    let msg = "";

    if (subjectInvalid) msg = "Please select a subject.";
    else if (dateInvalid) msg = "Please select a date from the calendar.";
    else if (tutorInvalid) msg = "Please select a tutor.";
    else if (startInvalid) msg = "Please select a time.";
    else if (studentNameInvalid) msg = "Please enter the name of the student.";
    else if (studentEmailInvalid) msg = "Please enter an email.";
    
    alert(msg);
  }
}

/**
 * Get Subject Categories with subjects
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

  console.time(`${_globalDayValue} - ${selectedSubjectId} - ${tutors.length} tutors`);
  console.log("TUTORS LOADING...");
  showLoadingScreen();
  // document.getElementById("toggle").style.display = "block";
  // document.body.style.overflow = "hidden";

  for (var k=0; k<tutors.length; k++) {
    var tutorId = tutors[k]["Subjects_Tutor::id_tutor"];
    var tutorName = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::TutorName_TutorInfo"];
    var tutorCateogry = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::Tutor Category"];
    var tutorShowOnWebsite = tutors[k]["T31_subjects_tutor_TUTOR||id_tutor::ShowOnWebsite"];
    var date = _globalDayValue;
    if (tutorCateogry!= "HWK-SPOT" || tutorShowOnWebsite === "Yes") await getTutorAvailabilityThroughFM(tutorId, date, tutorName);  
  }
  
  console.log("TUTOR LOADING DONE");
  console.timeEnd(`${_globalDayValue} - ${selectedSubjectId} - ${tutors.length} tutors`);
  hideLoadingScreen();
  // document.getElementById("toggle").style.display = "none";
  // document.body.style.overflow = "scroll";
  // overlay[0].style.display = "none";
  // overlay[1].style.display = "none";
}

async function getTutorAvailabilityThroughFM(tutorId, date, tutorName) {
  // see if all the found tutors are avaialble through FM script
  var availableTimes = [];

  // sessionId
  // let sessionId = [0,0,0].map((e) => Math.random().toString(36).replace(/[^a-z]+/g,'').substring(0,5)).join('');
  let sessionId = undefined;

  await fetch(apiUrl + `/getTutorAvailability/${date}-${tutorId}-${locationShort}`, {
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
      console.log("FOR: " + tutorName + "; " + availableTimes[0].fieldData.Tag + "; " + calculatedTimes[0]);
      if (availableTimes[0].fieldData.Tag.indexOf("Not Available") > 0  || calculatedTimes[0]=="Not Available" || tutorName == "Barbara Clary Zayas" || tutorName == "Ayesha Farheen" || tutorName == "Diana Sanchez" || tutorName == "Jessie Liss-Noda" || tutorName == "Ji Park" || tutorName == "Meryl Lee" || tutorName == "Shakira Davis" || tutorName == "Alyssa Crocker" || tutorName == "Will Neely" || tutorName == "Lily Riopelle" || tutorName == "Tejas Shah" || tutorName == "Brianna Tran" || tutorName == "Lauren Ludwig" || tutorName == "Monish Vijayaraghau" || tutorName == "Chrissy Park" || tutorName == "Carpenter Mooney") {
        console.log("FAILED " + tutorName + "; sessionID: " + sessionId);
      } else {
        console.log("PASSED " + tutorName + "; sessionID: " + sessionId);
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

  // console.log(`${selectedDate}-${selectedTutorId}-${locationShort}`);

  showLoadingScreen();
  // document.getElementById("toggle").style.display = "block";

  // sessionId
  // let sessionId = [0,0,0].map((e) => Math.random().toString(36).replace(/[^a-z]+/g,'').substring(0,5)).join('');
  let sessionId = undefined;

  console.time(`${_globalDayValue} - ${selectedTutorId}`);
  await fetch(apiUrl + `/getTutorAvailability/${selectedDate}-${selectedTutorId}-${locationShort}`, {
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
      console.timeEnd(`${_globalDayValue} - ${selectedTutorId}`);
      let availableTimes = myJson.results.record.response.data;
      let startTimes = calculateAvailableTimes(availableTimes);
      
      // Collect current date [DATE ONLY; NO TIME VALUE]
      let dt1 = new Date();
      let date = dt1.getDate();
      let mon = dt1.getMonth();
      let year = dt1.getFullYear();
      
      // If it is the current Date, then don't show times within 4 hours from now
      if ((new Date(`${mon+1}/${date}/${year}`)).toString() == (new Date(selectedDate)).toString()) {
        let allowedTime = new Date((new Date()).getTime() + 4*3600000);
        startTimes = startTimes.filter(time => new Date(`${mon+1}/${date}/${year} ${time}`) > allowedTime);
      }

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
  
  hideLoadingScreen();  
  // document.getElementById("toggle").style.display = "none";

}

/**
 * calculate Availability based on selected Duration
 * @param {array} arrayOfAvailableTimes array containing available start and end timestamps
 */
function calculateAvailableTimes(arrayOfAvailableTimes) {
  let selectedDuration = durationList.options[durationList.selectedIndex].value;
  let result = [];
  
  let allowedBookingTimeframe = 8;
  let allowedTime = new Date(new Date().getTime() + allowedBookingTimeframe*3600000);
  
  // check for when there are no available times
  if (arrayOfAvailableTimes[0].fieldData.Tag.indexOf("Not Available") > 0 ){
    result.push(["Not Available"]);
  } else {
    for (var i=0; i<arrayOfAvailableTimes.length; i++) {
      let startTime = new Date (arrayOfAvailableTimes[i].fieldData.StartTimestamp);
      let endTime = new Date (arrayOfAvailableTimes[i].fieldData.EndTimestamp);
      let defaultGap = 1;
      
      // figure out whether any times are within the non allowed booking timeframe
      if (!(allowedTime >= endTime)) {
        if (allowedTime > startTime && allowedTime < endTime) startTime = allowedTime; // startTime should be modified to allowedTime

        let numOfLessons = Math.floor ( ( ( ( (endTime-startTime) % (24*3600000) ) / 3600000 - selectedDuration ) / defaultGap ) + 1 ) ;
      
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
  document.body.style.overflow = "hidden";
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
  let mainPageChild = mainPageElement.children[0];
  mainPageElement.insertBefore(loadingScreen, mainPageChild);  
}

function hideLoadingScreen() {
  document.body.style.overflow = "scroll";
  document.getElementsByClassName("underneath")[0].style.opacity = 1.0;

  let loadingScreen = document.getElementsByClassName("loading")[0];
  document.getElementsByClassName("entry-content")[0].removeChild(loadingScreen);
}

/**
 * Generate string of 4 random characters
 */
function rand4() {
  return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}