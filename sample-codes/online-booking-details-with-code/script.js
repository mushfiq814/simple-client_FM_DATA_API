const base_url = 'https://api.disciplinedmindstutoring.com/';
const path = 'getLessonDetailsByCode/';
let code = undefined;

// Check URL
let url = new URLSearchParams(window.location.search);
// If URL has Code
if (url.has('code')) code = url.get('code');
// let code = '7KAXP0vUiLTVFVERU5UMTgyOUZBTUlMWTU0ODc0OTkhQIa8U9FtP';

// app variables. Required for Middleware API
const app = {
  project: "DM_FM17_API",
  environment: "DEV-LOCAL",
  version: "v1.0.0"
};

let _lessonDetails = {};

if (code!=undefined) {
  fetch(base_url + path + code, {
    method: "POST",
    headers: new Headers([
      ["DM-PROJECT", app.project],
      ["DM-ENVIRONMENT", app.environment],
      ["DM-VERSION", app.version]
    ]),
    cache: "no-cache"
  })
  .then((response) => response.json())
  .then((myJson) => {
    let data = myJson.results.record.response.data;

    if (data.length == 1) {
      _lessonDetails.lessonId = data[0]['fieldData']['Lesson_IDpk'];
      _lessonDetails.date = data[0]['fieldData']['Date'];
      _lessonDetails.start = data[0]['fieldData']['Start_Time'];
      _lessonDetails.end = data[0]['fieldData']['End_Time'];
      _lessonDetails.tutorId = data[0]['fieldData']['id_tutor'];
      _lessonDetails.tutor = data[0]['fieldData']['T03j_lessons_TUTOR||id_tutor::TutorName_TutorInfo'];
      _lessonDetails.subjectId = data[0]['fieldData']['id_subject'];
      _lessonDetails.subject = data[0]['fieldData']['T03_lessons_SUBJECT||id_subject::Subject Name'];
      _lessonDetails.student = data[0]['fieldData']['studentName'];
      _lessonDetails.location = data[0]['fieldData']['Location'];
      _lessonDetails.eventId = data[0]['fieldData']['event ID'];

      document.getElementById('loading').style.display = 'none';
      document.getElementById('container').style.display = 'grid';

      document.getElementById('lessonIdField').innerText = _lessonDetails.lessonId;
      document.getElementById('dateField').innerText = _lessonDetails.date;
      document.getElementById('startTimeField').innerText = _lessonDetails.start;
      document.getElementById('endTimeField').innerText = _lessonDetails.end;
      document.getElementById('tutorIdField').innerText = _lessonDetails.tutorId;
      document.getElementById('tutorNameField').innerText = _lessonDetails.tutor;
      document.getElementById('subjectIdField').innerText = _lessonDetails.subjectId;
      document.getElementById('subjectNameField').innerText = _lessonDetails.subject;
      document.getElementById('studentNameField').innerText = _lessonDetails.student;
      document.getElementById('locationField').innerText = _lessonDetails.location;
      document.getElementById('eventIdField').innerText = _lessonDetails.eventId;

    }
  })
}

function cancelLesson() {
  fetch
}