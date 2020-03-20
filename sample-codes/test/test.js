appData = {
  apiUrl: "https://api.disciplinedmindstutoring.com",
  project: "DM_FM17_API",
  environment: "DEV-LOCAL",
  version: "v1.0.0"
};

getSubjects = (url) => {
  fetch(url + "/getSubjectsFromCategories", {
    method: "GET",
    headers: new Headers([
      ["DM-PROJECT", appData.project],
      ["DM-ENVIRONMENT", appData.environment],
      ["DM-VERSION", appData.version]
    ]),
    cache: "no-cache"
  }).then((response) => response.json())
    .then((data) => console.log(data))
}

let data = {
  subjectID: 499,
  tutorID: "T16",
  date: "1/25/2020",
  start: "2:30 pm",
  student: "Ingrid Madeupname",
  duration: 1.5,
  location: "South Tampa",
  studentPhone: "8135555555",
  studentEmail: "mushfiq8194@gmail.com",
  parentName: "Stewart Madeupname",
  parentPhone: "8130000000",
  parentEmail: "mushfiq8194@gmail.com",
  existingCustomer: "Yes",
  scriptName: "Validate_Online_Booking",
  scriptParam: "N/A"
}

create = (url) => {
  formData = new FormData();
  // set desired values to be sent into http body
  formData.append("subjectID", data.subjectID);
  formData.append("tutorID", data.tutorID);
  formData.append("date", data.date);
  formData.append("start", data.start);
  formData.append("student", data.student);
  formData.append("duration", data.duration);
  formData.append("location", data.location);

  formData.append("studentEmail", data.studentEmail);
  formData.append("studentPhone", data.studentPhone);
  formData.append("parentName", data.parentName);
  formData.append("parentEmail", data.parentEmail);
  formData.append("parentPhone", data.parentPhone);
  formData.append("existingCustomer", data.existingCustomer);

  formData.append("scriptName", data.scriptName);
  formData.append("scriptParam", data.scriptParam);

  fetch(url + "/create", {
    method: "POST",
    headers: new Headers([
      ["DM-PROJECT", appData.project],
      ["DM-ENVIRONMENT", appData.environment],
      ["DM-VERSION", appData.version]
    ]),
    body: formData,
    cache: "no-cache"
  }).then((response) => response.json())
    .then((data) => console.log(data))
}

getSubjects(appData.apiUrl);
create(appData.apiUrl);