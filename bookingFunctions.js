var globalPageStateDay = 0;

function drawCalendarWeek(delta) {
  var tempDate = new Date();
  var startDate = new Date(tempDate.getTime()+globalPageStateDay*24*3600000+delta*24*3600000);
  
  if (delta==1) globalPageStateDay++;
  else if (delta==-1) globalPageStateDay--;

  var dayArray = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  
  var dayItem = document.getElementsByClassName('day-item');
  for (k=0;k<dayItem.length; k++) {
    var tempDate = new Date(startDate);
    tempDate.setDate(tempDate.getDate() + k);
    var date = document.getElementsByClassName('date-view');
    var day = document.getElementsByClassName('day-view');
    date[k].innerHTML = (tempDate.getDate());
    day[k].innerHTML = (dayArray[tempDate.getDay()]);
  }
}

window.onload = drawCalendarWeek(0);