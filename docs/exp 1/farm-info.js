// "Sensors Used" card: clicking a sensor button shows its name in the box below.

var sensorButtons = document.querySelectorAll(".sensor-btn");
var sensorName = document.getElementById("sensor-name");

// Marks one button as selected (and the rest as not) and shows its name.
function showSelectedSensor(selectedButton) {
  sensorButtons.forEach(function (button) {
    var isSelected = button === selectedButton;
    button.classList.toggle("selected", isSelected);
    button.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
  sensorName.textContent = selectedButton.textContent.trim();
}

sensorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    showSelectedSensor(button);
  });
});
