// document is the whole HTML page
// getElementById finds the element whose id matches,
const title = document.getElementById("title");
const time = document.getElementById("time");

// Runs the function once straight away,
// The page shows the time as soon as it loads.
updateClock();

// Calls updateClock again every 1000 milliseconds (1 second)
// This keeps the clock ticking.
setInterval(updateClock, 1000);

// FUNCTIONS SECTION

// This function takes an hour and returns a string.
// Return exits the function straight away.
// The checks run in order.
function getGreeting(hour) {
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// This function updates the clock on the page.
function updateClock() {
  // creates an object holding the current date and time.
  const now = new Date();

  // returns the hour (0–23)
  const hour = now.getHours();

  title.textContent = getGreeting(hour);

  // formats the time same as user's computer i.e. 24 hrs / non 24 hrs.
  time.textContent = now.toLocaleTimeString();
}
