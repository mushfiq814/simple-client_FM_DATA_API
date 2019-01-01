var _globalPageStateDay = 0;
var _globalJsonCategoryData = '';
var _globalJsonSubjectData = '';
var dayValue = '12/20/2019';

window.onload = function() {
  var categoryList = document.getElementById('categoryList');
  var subjectList = document.getElementById('subjectList');
  var tutorList = document.getElementById('tutorList');
  var timeList = document.getElementById('timeList');
  var nameField = document.getElementById('nameField');
  var emailField = document.getElementById('emailField');
  var phoneField = document.getElementById('phoneField');
  var submitBtn = document.getElementById('submitBtn');
  var dayItem = document.getElementsByClassName('day-item');
  
  drawCalendarWeek(0);
  submitBtn.addEventListener('click', create, false);
  subjectList.addEventListener('change', updateTutorDropDown);
  categoryList.addEventListener('change', updateSubjectDropDown);
  
  // TODO: Figure out a way to apply the function to all the dayItem elements
  // Currently, the looping is done on load and the context is lost after the eventListener has been added
  for (var i=0; i<dayItem.length; i++) {
    var selectedMonth = dayItem[i].getElementsByClassName('month-view')[0].innerText;
    var selectedDate = dayItem[i].getElementsByClassName('date-view')[0].innerText;
    dayItem[i].addEventListener('mouseup', (selectedMonth, selectedDate)=>{
      const monthLookup= {
        "Jan": "01",
        "Feb": "02",
        "Mar": "03",
        "Apr": "04",
        "May": "05",
        "Jun": "06",
        "Jul": "07",
        "Aug": "08",
        "Sep": "09",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12",
      }
      console.log(monthLookup[selectedMonth]+'/'+selectedDate+'/2018');
      dayValue = monthLookup[selectedMonth]+'/'+selectedDate+'/2018';
    });
  }
  getSubjects();
  getTutors();
}

/**
 * fill up dates and day for Calendar View
 * @param {int} delta increment for finding dates from current date 
 */
function drawCalendarWeek(delta) {
  var tempDate = new Date();
  var startDate = new Date(tempDate.getTime()+(_globalPageStateDay+delta)*24*3600000);
  
  if (delta==1) _globalPageStateDay++;
  else if (delta==-1) _globalPageStateDay--;

  var dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var monthArray = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  
  var dayItem = document.getElementsByClassName('day-item');
  setTimeout(()=> {
    for (k=0;k<dayItem.length; k++) {
      var tempDate = new Date(startDate);
      tempDate.setDate(tempDate.getDate() + k);
      var month = document.getElementsByClassName('month-view');
      var date = document.getElementsByClassName('date-view');
      var day = document.getElementsByClassName('day-view');
      month[k].innerHTML = (monthArray[tempDate.getMonth()]);
      date[k].innerHTML = (tempDate.getDate());
      day[k].innerHTML = (dayArray[tempDate.getDay()]);
    }
  },0)
}

app = {
  project: 'FM17_REST_DEMO',
  environment: 'DEV-LOCAL',
  version: 'v1.0.0'
};

/**
 * creates a new FileMaker record using Data API
 * @param {event} event submit button click event
 * @return fetch response from /fmi/data/v1/databases/database-name/layouts/layout-name/records
 */
function create(event) {
  event.preventDefault();
  
  var formData;
  formData = new FormData();
  formData.append("subject", subjectList.options[subjectList.selectedIndex].innerHTML);
  formData.append("tutor", tutorList.options[tutorList.selectedIndex].innerHTML);
  formData.append("date", dayValue);
  formData.append("time", timeList.options[timeList.selectedIndex].innerHTML);
  formData.append("name", nameField.value);
  formData.append("email", emailField.value);
  formData.append("phoneNumber", phoneField.value);

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
    console.log(response.json);
  });
}

/**
 * get one FileMaker record
 * @return fetch response from /fmi/data/v1/databases/database-name/layouts/layout-name/records/record-id
 */
function getOne() {
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

/**
 * get all FileMaker records
 * @return fetch response from /fmi/data/v1/databases/database-name/layouts/layout-name/records
 *  "fieldData": {
 *    "Subjects": "AP Physics",
 *    "SubjectId_pk": "S001"
 *  },
 *  "portalData": {
 *    JoinTable": [
 *      {
 *        "recordId": "5",
 *        "JoinTable::TutorId_fk": "T01",
 *        "Tutors::Tutors": "Scott Allen",
 *        "modId": "0"
 *      },
 *    ]
 *  }
 */
function getAll() {
  console.log("Connecting to FileMaker");
  fetch('http://localhost:8000/retrieveAll', {
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
    var data = myJson.results.records.response.data;
    for (var i=0; i<data.length; i++) {
      var subject = data[i].fieldData.Subjects;      
      var opt = document.createElement('option');
      opt.value = "subject"+i+1;
      opt.innerHTML = subject;
      subjectList.appendChild(opt);

      _globalJsonSubjectData = data;
    }
  }).then(()=>{
    console.log("Successfully  Connection!");
  })
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

      _globalJsonCategoryData = data;
    }
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

      _globalJsonSubjectData = data;
    }
  }).then(()=>{
    console.log("Successfully got Subject & Tutor List!");
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

function selectDate(dayItemElement) {
  // console.log(dayItemElement.text);
  // console.log("Hell Yeah!");
}
