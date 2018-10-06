// Initialize Firebase
var config = {
  apiKey: "AIzaSyB1lIZnFQljNF1irh_uO8-ohrL5RgSzCrY",
  authDomain: "train-timetable-63ee4.firebaseapp.com",
  databaseURL: "https://train-timetable-63ee4.firebaseio.com",
  projectId: "train-timetable-63ee4",
  storageBucket: "train-timetable-63ee4.appspot.com",
  messagingSenderId: "1048745646809"
};
firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

// Initial Values
var name = "";
var destination = "";
var firstTime = "";
var frequency = "";

// Capture Button Click
$("#add-train").on("click", function (event) {
  event.preventDefault();

  // Grabbed values from text boxes
  name = $("#input-name").val().trim();
  destination = $("#input-dest").val().trim();
  firstTime = $("#input-first-time").val().trim();
  frequency = $("#input-frequency").val().trim();


  // Code for handling the push
  database.ref().push({
    name: name,
    destination: destination,
    firstTime: firstTime,
    frequency: frequency,
  });

  alert("Train Successfully Added");

});

// Firebase watcher
database.ref().on("child_added", function (snapshot) {

  let row = $("<tr>");
  row.addClass("row-class");
  row.attr("data-id", snapshot.key);
  let nameTd = $("<td>");
  nameTd.text(snapshot.val().name);
  let destinationTd = $("<td>");
  destinationTd.text(snapshot.val().destination);
  let frequencyTd = $("<td>");
  frequencyTd.text(snapshot.val().frequency)
  let nextTd = $("<td>");
  let timeAwayTd = $("<td>");
  let cancelTd = $("<td>");
  let cancelButton = $("<button>")
  let cross = $("<i>");
  cross.addClass("fas fa-times-circle");
  cancelButton.addClass("btn btn-danger text-center delete");
  cancelButton.attr("data-id", snapshot.key);

  // Button event handler
  cancelButton.on("click", cancelHandler);

  var tFrequency = snapshot.val().frequency;
  var firstTime = snapshot.val().firstTime;

  // First time of train converted
  var firstTimeConverted = moment(firstTime, "HH:mm");
  console.log("First Time in " + firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("Current time = " + currentTime);

  // Difference between Current Time and First Time
  var diffTime = currentTime.diff(moment(firstTimeConverted), "minutes");
  console.log("Difference in minutes = " + diffTime);

  // Remainder
  var tRemainder = diffTime % tFrequency;
  console.log("Remainder = " + tRemainder);

  // Minutes until next arrival
  var tMinutesNextArrival = tFrequency - tRemainder;
  console.log("Minutes for next arrival: " + tMinutesNextArrival);

  // Time next arrival
  var nextArrival = currentTime.add(tMinutesNextArrival, "minutes");
  console.log("Next Arrival Time: " + moment(nextArrival).format("hh:mm"));

  nextTd.text(moment(nextArrival).format("hh:mm"));
  timeAwayTd.text(tMinutesNextArrival);

  row.append(nameTd);
  row.append(destinationTd);
  row.append(frequencyTd);
  row.append(nextTd);
  row.append(timeAwayTd);
  row.append(cancelTd);
  cancelTd.append(cancelButton);
  cancelButton.append(cross);

  row.appendTo("#tbody");

  // Handle the errors
}, function (errorObject) {
  console.log("Errors handled: " + errorObject.code);
});

function cancelHandler () {
  var dataKey = $(this).attr("data-id");
  console.log(dataKey);
  database.ref(dataKey).remove();
  $(`tr[data-id='${dataKey}']`).remove();
};