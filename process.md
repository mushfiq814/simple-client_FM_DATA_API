# Process Explanation

## *functions*

### Middleware API functions
1. `getSubjects()` gets a list of Categories with Subjects inside them
2. `getTutors()` gets a list of Subjects with the tutors inside them

### HTML Creation functions
1. `updateSubjectDropDown()` generates the subject dropdown based on info from `getSubjects()`
2. `updateTutorDropDown()` generates the tutor dropdown based on info from `getTutors()`
3. `updateTimeDropDown()` generates the time dropdown based on:
   * selected Tutor
   * selected Date
   * selected Duration

### Time Calculation functions
1. `sortAvailabilityArray()` 
2. `getTutorStartAndEndTimes()` 
3. `getAppointmentsForTheDay()` 
4. `getTutorBlockTimes()` 
5. `refreshTutorAccessToken()` 
6. `getTutorEventsForTheDay()` 
7. `findAvailableTimes()` 

```javascript
var _globalPageStateDay = 0;
var _globalJsonCategoryData = "";
var _globalJsonSubjectData = "";
var _globalJsonAppointmentData = "";
var _globalJsonTutorAvailabilityData = "";
var _globalDayValue = "";
var _globalJsonTutorGoogleTokensData = "";
var _globalNumOfDaysCreated = 0;
```



