// GLOBAL VARIABLES FOR THE WHOLE DOCUMENT
var _globalPageStateDay = 0;
var _globalJsonCategoryData = '';
var _globalJsonSubjectData = '';
var _globalJsonAppointmentData = '';
var _globalDayValue = '';

// onload starting function
window.onload = function() {
  // cache the DOM
  var categoryList = document.getElementById('categoryList');
  var subjectList = document.getElementById('subjectList');
  var tutorList = document.getElementById('tutorList');
  var timeList = document.getElementById('timeList');
  var durationList = document.getElementById('timeList');
  var nameField = document.getElementById('nameField');
  var emailField = document.getElementById('emailField');
  var phoneField = document.getElementById('phoneField');
  var submitBtn = document.getElementById('submitBtn');
  var dayItem = document.getElementsByClassName('day-item');
  
  // generate the day-item elements with dates starting from today
  drawCalendarWeek(0);
  // add Event Listeners
  submitBtn.addEventListener('click', create, false);
  subjectList.addEventListener('change', updateTutorDropDown);
  categoryList.addEventListener('change', updateSubjectDropDown);
  tutorList.addEventListener('change', updateTimeDropDown);
  
  // iteratively add Event Listeners to each day-item element on click
  for (var i=0; i<dayItem.length; i++) {
    dayItem[i].addEventListener('click', (event)=>{
      var eventTarget = event.target; // the clicked element
      var eventTargetParent = event.target.parentElement; // the parent of the clicked element
      var eventTargetParentClass = event.target.parentElement.className; // class for the parent of the clicked element

      if (eventTargetParentClass == 'day-item') { // if the inside dates or months were clicked
        // get info from the parent element which is the 'day-item' element
        var date = eventTargetParent.getElementsByClassName('date-view')[0].innerHTML;
        var monthYear = eventTargetParent.getElementsByClassName('month-view')[0].innerHTML;
      } else if (eventTargetParentClass == 'calendar-week-view') { // if the day-item element was clicked
        // get info from that element since it is the 'day-item' element
        var date = eventTarget.getElementsByClassName('date-view')[0].innerHTML;
        var monthYear = eventTarget.getElementsByClassName('month-view')[0].innerHTML;
      }

      // set the date inside the element to the global variable so it is known accross the document
      _globalDayValue = formatDate(new Date(date + " " + monthYear));

      // update the Time dropdown to reflect the changed date
      updateTimeDropDown();
    });
  }

  getSubjects();
  getTutors();
  getAppointments();
}

/**
 * formats the date given into MM/dd/yyyy format
 * @param {date} date date object to be formatted in MM/dd/yyyy
 */
function formatDate(date) {
  var mon = date.getMonth()+1;
  var day = date.getDate();
  var yea = date.getFullYear();
  mon = mon < 10 ? '0'+mon : mon; // add leading zeros
  day = day < 10 ? '0'+day : day;
  return mon + '/' + day + '/' + yea;
}

/**
 * fill up dates and day for Calendar View
 * @param {int} delta increment for finding dates from current date 
 */
function drawCalendarWeek(delta) {
  var tempDate = new Date();
  var startDate = new Date(tempDate.getTime()+(_globalPageStateDay+delta)*24*3600000); // startDate depends on the increment passed in
  
  if (delta==1) _globalPageStateDay++; // next Day
  else if (delta==-1) _globalPageStateDay--; // previous Day

  // arrays for lookup days and months 
  var dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  var dayItem = document.getElementsByClassName('day-item');
  // TODO: Fix setTimeout()
  // NOTE: setTimeout is used here since the day-items are not created on page load and a 0 second delay has to be used
  setTimeout(()=> {
    for (k=0; k<dayItem.length; k++) {
      tempDate = new Date(startDate);
      tempDate.setDate(tempDate.getDate() + k);
      var month = document.getElementsByClassName('month-view');
      var date = document.getElementsByClassName('date-view');
      var day = document.getElementsByClassName('day-view');
      month[k].innerHTML = (monthArray[tempDate.getMonth()] + ' ' + tempDate.getFullYear());
      date[k].innerHTML = (tempDate.getDate());
      day[k].innerHTML = (dayArray[tempDate.getDay()]);
    }
  },0)
}

// app variables. Required for Middleware API
app = {
  project: 'FM17_REST_DEMO',
  environment: 'DEV-LOCAL',
  version: 'v1.0.0'
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
  formData.append("subject", subjectList.options[subjectList.selectedIndex].innerHTML);
  formData.append("tutor", tutorList.options[tutorList.selectedIndex].innerHTML);
  formData.append("date", _globalDayValue);
  formData.append("time", timeList.options[timeList.selectedIndex].innerHTML);
  formData.append("name", nameField.value);
  formData.append("email", emailField.value);
  formData.append("phoneNumber", phoneField.value);

  // POST request
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
  }).then(()=>{
    console.log("Request Complete...");
  });
}

/**
 * Get Subject Categories with subjects
 */
function getSubjects() {
  console.log("Connecting to FileMaker");
  fetch('http://localhost:8000/getSubjects', {
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
      var category = data[i].fieldData.Category;      
      var opt = document.createElement('option');
      opt.value = "category"+i+1;
      opt.innerHTML = category;
      categoryList.appendChild(opt);

    }
    _globalJsonCategoryData = data;
  }).then(()=>{
    console.log("Successfully got Category & Subject List!");
  })
}

/**
 * Get subjects with tutors
 */
function getTutors() {
  console.log("Connecting to FileMaker");
  fetch('http://localhost:8000/getTutors', {
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
      var subject = data[i].fieldData.Subjects;
      var opt = document.createElement('option');
      opt.value = "subject"+i+1;
      opt.innerHTML = subject;
      subjectList.appendChild(opt);

    }
    _globalJsonSubjectData = data;
  }).then(()=>{
    console.log("Successfully got Subject & Tutor List!");
  })
}

/**
 * Get appointments with times
 */
function getAppointments() {
  fetch('http://localhost:8000/getAppointments', {
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

    data.sort((a,b)=>{
      if (a.fieldData.DateTimeConcat < b.fieldData.DateTimeConcat) return -1;
      if (a.fieldData.DateTimeConcat > b.fieldData.DateTimeConcat) return 1;
      else return 0;
    });

    _globalJsonAppointmentData = data;
  })
}

/**
 * Updates select tags with relevant option tags. 
 * Should be called whenever higher order select field is changed
 */
function updateSubjectDropDown() {
  var selectedCategory = categoryList.options[categoryList.selectedIndex].innerHTML;
  var selectedCategoryIndex = -1;
  for (var i=0; i<_globalJsonCategoryData.length; i++) {
    if (_globalJsonCategoryData[i].fieldData.Category == selectedCategory) {
      selectedCategoryIndex = i;
      break;
    }
  }
  
  // TODO: Create variables for layout names such as SubjectToTutors.
  var subjects = _globalJsonCategoryData[selectedCategoryIndex].portalData.Subjects;
  subjectList.innerHTML = "";
  for (var j=0; j<subjects.length; j++) {
    var subject = subjects[j]["Subjects::Subjects"];
    var opt = document.createElement('option');
    opt.value = "subject"+j+1;
    opt.innerHTML = subject;
    subjectList.appendChild(opt);
  }
}

/**
 * Updates select tags with relevant option tags. 
 * Should be called whenever higher order select field is changed
 */
function updateTutorDropDown() {
  var selectedSubject = subjectList.options[subjectList.selectedIndex].innerHTML;
  var selectedSubjectIndex = -1;
  for (var i=0; i<_globalJsonSubjectData.length; i++) {
    if (_globalJsonSubjectData[i].fieldData.Subjects == selectedSubject) {
      selectedSubjectIndex = i;
      break;
    }
  }
  
  // TODO: Create variables for layout names such as SubjectToTutors.
  var tutors = _globalJsonSubjectData[selectedSubjectIndex].portalData.SubjectToTutors;
  tutorList.innerHTML = "";
  for (var j=0; j<tutors.length; j++) {
    var tutor = tutors[j]["Tutors::Tutors"];
    var opt = document.createElement('option');
    opt.value = "tutor"+j+1;
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
  var appointmentStartTimes = [];
  for (var i=0; i<_globalJsonAppointmentData.length; i++) {
    if (_globalJsonAppointmentData[i].fieldData.Tutor == selectedTutor && _globalJsonAppointmentData[i].fieldData.Date == selectedDate) {
      appointmentStartTimes.push(_globalJsonAppointmentData[i].fieldData.Time);
    }
  }
  console.log(appointmentStartTimes);
  var availableTimes = findAvailabilities(appointmentStartTimes);
  timeList.innerHTML = "";
  for (var j=0; j<availableTimes.length; j++) {
    var opt = document.createElement('option');
    opt.value = "time"+j+1;
    opt.innerHTML = availableTimes[j];
    timeList.appendChild(opt);
  }
}

/**
 * Calculates 1 hour long availabilities between appointments provided
 * @param {array} timeArray Array with appointment start times 
 * @returns array of availabilities
 * TODO: Find a way to include start time as start of day and end time as end of day
 */
function findAvailabilities(timeArray) {
  var availableTimes = [];
  for (i=0; i<timeArray.length-1; i++) {
    var start = new Date("01/04/2019 " + timeArray[i]);
    var nxtStart = new Date("01/04/2019 " + timeArray[i+1]);
    var numberOfApps = (nxtStart.getHours() - (start.getHours()+1));
    for (j=0; j<numberOfApps; j++) {
      availableTimes.push(start.getHours() + j + 1 + ":00:00");
    }   
  }
  return availableTimes;
}
