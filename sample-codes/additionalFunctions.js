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
  fetch('http://localhost:8000/retrieve100', {
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

