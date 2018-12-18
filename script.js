var nm = document.getElementById('nm');
var em = document.getElementById('em');
var submitBtn = document.getElementById('btn');

app = {
  project: 'FM17_REST_DEMO',
  environment: 'DEV-LOCAL',
  version: 'v1.0.0'
};

var contact = {
  name: '',
  email: '',
  add: function() {
    var formData, p;

    formData = new FormData();
    formData.append("name", this.name);
    formData.append("email", this.email);
    console.log(formData);

    fetch('http://api.aladhan.com/v1/calendar?latitude=51.508515&longitude=-0.1254872&method=2&month=4&year=2017')
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        console.log(JSON.stringify(myJson));
      });

    // p.open("POST", 'http://localhost:8000/contacts');
    // p.setRequestHeader('X-RCC-PROJECT', app.project);
    // p.setRequestHeader('X-RCC-ENVIRONMENT', app.environment);
    // p.setRequestHeader('X-RCC-VERSION', app.version);
    // p.send(formData);

    return p;

    // p = fetch('http://localhost:8000/contacts', {
    //   method: 'POST',
    //   headers: new Headers(
    //     [
    //       ['X-RCC-PROJECT', app.project], 
    //       ['X-RCC-ENVIRONMENT', app.environment], 
    //       ['X-RCC-VERSION', app.version]
    //     ]
    //   ),
    //   body: formData,
    //   cache: 'no-cache'
    // });
    // return p;
  }
};

onSubmit = function(event) {
  event.preventDefault();

  contact.name = nm.value;
  contact.email = em.value;
  
  contact.add();
}

window.onload = function() {
  submitBtn.addEventListener('click', onSubmit, false);
}

