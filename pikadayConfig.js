let maxNumberOfAvailableBookingDates = 120;
let maxNumberOfUnbookableHoursFromNow = 4;
let today = new Date();
let minDate = new Date(today.getTime() + maxNumberOfUnbookableHoursFromNow*3600000);
let maxDate = new Date("06/30/2020");
// let maxDate = new Date(today.getTime() + maxNumberOfAvailableBookingDates * 24 * 3600000);
let picker = new Pikaday({
  field: document.getElementById('datepicker') 
});
picker.setMinDate(minDate);
picker.setMaxDate(maxDate);