let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
let _globalDate = new Date();

today = new Date();
currentMonth = today.getMonth();
currentYear = today.getFullYear();

let prevBtn = document.getElementById('prevBtn');
let nextBtn = document.getElementById('nextBtn');

/**
 * click Event Handlers for next and prev buttons
 */
function next(e) {
  e.preventDefault();
  currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  currentMonth = (currentMonth + 1) % 12;
  createDayItems(currentMonth, currentYear);
}

function previous(e) {
  e.preventDefault();
  currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  createDayItems(currentMonth, currentYear);
}

nextBtn.addEventListener('click', e => next(e));
prevBtn.addEventListener('click', e => previous(e));

/**
 * create HTML elements for day-items
 * @param {number} month month parameter in digits 
 * @param {number} year year parameter in digits 
 */
function createDayItems(month, year) {
  let calendarMonthView = document.getElementById('calendarMonthView');
  let monthAndYear = document.getElementById('monthAndYear');
  let generatingArea = document.getElementById('additionalItems');
  generatingArea.innerHTML = "";

  // Update the month and year heading as well as the global date value
  monthAndYear.innerHTML = months[month] + " " + year;
  _globalDate.setMonth(month);
  _globalDate.setFullYear(year);
  
  // inactive days before the start of the month
  let dt = new Date(year, month, 1);
  let daysInPrevMonth = dt.getDay();
  for (i=0; i<daysInPrevMonth; i++) {
    let dayItem = document.createElement('div');
    dayItem.classList.add('inactive-day-item');
    generatingArea.appendChild(dayItem);
  }

  // day items
  let numOfDays = 32 - new Date(year, month, 32).getDate();
  for (j=0; j<numOfDays; j++) {
    
    var checkBx = document.createElement('input');
    checkBx.type = 'checkbox';
    checkBx.setAttribute('id', ('demo'+j));
    checkBx.classList.add('checkBx');

    var label = document.createElement('label');
    label.setAttribute('for', ('demo'+j));

    let dayItem = document.createElement('div');
    dayItem.classList.add('day-item');
    generatingArea.appendChild(dayItem);

    let dateView = document.createElement('p');
    dateView.classList.add('date-view');
    dateView.innerHTML = (j+1);
    dayItem.appendChild(dateView);

    label.appendChild(dayItem);
    generatingArea.appendChild(checkBx);
    generatingArea.appendChild(label);
  }

  // inactive days after the start of the month
  let remainingInactiveDays = 7 - ( daysInPrevMonth + numOfDays ) % 7;
  for (k=0; k<remainingInactiveDays; k++) {
    let dayItem = document.createElement('div');
    dayItem.classList.add('inactive-day-item');
    generatingArea.appendChild(dayItem);
  }
}

function addClickListenerToDayItems() {
  let dayItem = document.getElementsByClassName('day-item');

  // iteratively add Event Listeners to each day-item element on click
  for (var i = 0; i < dayItem.length; i++) {
    dayItem[i].addEventListener("click", event => {
      // var eventTarget = event.target; // the clicked element
      // var eventTargetClass = event.target.className; // class for the clicked element
      // var eventTargetParent = event.target.parentElement; // the parent of the clicked element
      // var eventTargetParentClass = event.target.parentElement.className; // class for the parent of the clicked element
      
      // var changeColorElement = "";
      // if (eventTargetParentClass == "day-item") changeColorElement = eventTargetParent; // if the inside dates or months were clicked
      // else if (eventTargetClass == "day-item") changeColorElement = eventTarget; // if the day-item element was clicked
  
      // // revert the background color to default
      // var dayItem = document.getElementsByClassName("day-item");
      // for (var j = 0; j < dayItem.length; j++) {
      //   dayItem[j].style.backgroundColor = "#2c7fb4";
      // }

      // // change color to show selected
      // changeColorElement.style.backgroundColor = "#111";

      // update the date depending on the currently selected Date
      _globalDate.setDate(changeColorElement.innerText);
      console.log(changeColorElement);
  
      // set the date inside the element to the global variable so it is known accross the document
      // _globalDayValue = formatDate(new Date(date + " " + monthYear));
      // console.log(_globalDayValue);
    });
  }
}

createDayItems(currentMonth,currentYear);
addClickListenerToDayItems();


// today = new Date();
// currentMonth = today.getMonth();
// currentYear = today.getFullYear();
// selectYear = document.getElementById("year");
// selectMonth = document.getElementById("month");



// monthAndYear = document.getElementById("monthAndYear");
// showCalendar(currentMonth, currentYear);

// function next() {
//   currentYear = currentMonth === 11 ? currentYear + 1 : currentYear;
//   currentMonth = (currentMonth + 1) % 12;
//   showCalendar(currentMonth, currentYear);
// }

// function previous() {
//   currentYear = currentMonth === 0 ? currentYear - 1 : currentYear;
//   currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
//   showCalendar(currentMonth, currentYear);
// }

// function jump() {
//   currentYear = parseInt(selectYear.value);
//   currentMonth = parseInt(selectMonth.value);
//   showCalendar(currentMonth, currentYear);
// }

// function showCalendar(month, year) {
//   let firstDay = new Date(year, month).getDay();

//   tbl = document.getElementById("calendar-body"); // body of the calendar

//   // clearing all previous cells
//   tbl.innerHTML = "";

//   // filing data about month and in the page via DOM.
//   monthAndYear.innerHTML = months[month] + " " + year;
//   selectYear.value = year;
//   selectMonth.value = month;

//   // creating all cells
//   let date = 1;
//   for (let i = 0; i < 6; i++) {
//     // creates a table row
//     let row = document.createElement("tr");

//     //creating individual cells, filing them up with data.
//     for (let j = 0; j < 7; j++) {
//       if (i === 0 && j < firstDay) {
//         cell = document.createElement("td");
//         cellText = document.createTextNode("");
//         cell.appendChild(cellText);
//         row.appendChild(cell);
//       } else if (date > daysInMonth(month, year)) {
//         break;
//       } else {
//         cell = document.createElement("td");
//         cellText = document.createTextNode(date);
//         if (
//           date === today.getDate() &&
//           year === today.getFullYear() &&
//           month === today.getMonth()
//         ) {
//           cell.classList.add("bg-info");
//         } // color today's date
//         cell.appendChild(cellText);
//         row.appendChild(cell);
//         date++;
//       }
//     }

//     tbl.appendChild(row); // appending each row into calendar body.
//   }
// }


