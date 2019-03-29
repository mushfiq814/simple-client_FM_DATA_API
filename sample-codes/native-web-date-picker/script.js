var dateObject = document.getElementById('date');

function formatDateForDateElement(date) {
  var mon = date.getMonth() + 1;
  var day = date.getDate();
  var yea = date.getFullYear();
  mon = mon < 10 ? "0" + mon : mon; // add leading zeros
  day = day < 10 ? "0" + day : day;
  return yea + "-" + mon + "-" + day;
}

var currentDate = new Date();
var formattedCurrentDate = formatDateForDateElement(currentDate);
var delta = 60;

var maxDate = new Date(currentDate.getTime() + delta * 24 * 3600000);
var formattedMaxDate = formatDateForDateElement(maxDate);

console.log("currentDate: " + formattedCurrentDate );
console.log("maxDate: " + formattedMaxDate );

dateObject.value = formattedCurrentDate;
dateObject.min = formattedCurrentDate;
dateObject.max = formattedMaxDate;