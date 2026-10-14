// Farmer Registration form validation
// Each validateXxx() function checks one field and returns an error
// message, or "" when the value is valid.

// ---- Regular expressions for structured fields ----
var NAME_REGEX = /^[A-Za-z][A-Za-z .'-]*$/;
var MOBILE_REGEX = /^\d{10}$/;
var MOBILE_START_REGEX = /^[6-9]/;
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var PLOT_ID_REGEX = /^PLT-\d{3,}$/i;
var VILLAGE_REGEX = /^[A-Za-z][A-Za-z .'-]+$/;
var MAX_PHOTO_BYTES = 5 * 1024 * 1024;

// ---- DOM access ----
var form = document.getElementById("regForm");
var successBox = document.getElementById("form-success");

function byId(id) {
  return document.getElementById(id);
}

// Local-time YYYY-MM-DD, so "today" is right in any timezone.
function todayString() {
  var d = new Date();
  var month = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

// ---- Individual validation functions ----
function validateName() {
  var value = byId("name").value.trim();
  if (value === "") return "Please enter your full name.";
  if (value.length < 3) return "Name must be at least 3 characters.";
  if (!NAME_REGEX.test(value)) return "Name can only contain letters, spaces, . ' and -.";
  return "";
}

function validateMobile() {
  var value = byId("mobile").value.trim();
  if (value === "") return "Please enter your mobile number.";
  if (!MOBILE_REGEX.test(value)) return "Mobile number must be exactly 10 digits.";
  if (!MOBILE_START_REGEX.test(value)) return "Mobile number must start with 6, 7, 8 or 9.";
  return "";
}

function validateEmail() {
  var value = byId("email").value.trim();
  if (value === "") return "Please enter your email address.";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email, e.g. you@example.com.";
  return "";
}

function validatePlotId() {
  var value = byId("plotid").value.trim();
  if (value === "") return "Please enter your Plot ID.";
  if (!PLOT_ID_REGEX.test(value)) return "Plot ID must look like PLT-106.";
  return "";
}

function validateVillage() {
  var value = byId("village").value.trim();
  if (value === "") return "Please enter your village name.";
  if (!VILLAGE_REGEX.test(value)) return "Village name can only contain letters and spaces.";
  return "";
}

function validateCropStage() {
  if (form.elements.cropstage.value === "") return "Please select a crop stage.";
  return "";
}

function validateSoilType() {
  if (byId("soiltype").value === "") return "Please select a soil type.";
  return "";
}

function validateIrrigationMethod() {
  if (form.elements.irrigationmethod.value === "") return "Please select an irrigation method.";
  return "";
}

function validateDate() {
  var value = byId("regdate").value;
  if (value === "") return "Please choose a registration date.";
  if (value > todayString()) return "Registration date cannot be in the future.";
  return "";
}

function validatePhoto() {
  var file = byId("farmphoto").files[0];
  if (!file) return ""; // the photo is optional
  if (file.type.indexOf("image/") !== 0) return "Please upload an image file.";
  if (file.size > MAX_PHOTO_BYTES) return "Image must be 5 MB or smaller.";
  return "";
}

// ---- Showing / clearing errors ----
function showError(el, message) {
  var err = el.nextElementSibling;
  if (!err || !err.classList.contains("error")) {
    err = document.createElement("span");
    err.className = "error";
    err.setAttribute("role", "alert");
    el.insertAdjacentElement("afterend", err);
  }
  err.textContent = message;
  el.classList.toggle("invalid", message !== "");
  if (!el.classList.contains("radio-group")) {
    el.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }
}

// ---- Wiring each field to its validator ----
var fields = [
  { el: byId("name"), validate: validateName },
  { el: byId("mobile"), validate: validateMobile },
  { el: byId("email"), validate: validateEmail },
  { el: byId("plotid"), validate: validatePlotId },
  { el: byId("village"), validate: validateVillage },
  { el: form.querySelector('input[name="cropstage"]').closest(".radio-group"), validate: validateCropStage },
  { el: byId("soiltype"), validate: validateSoilType },
  { el: form.querySelector('input[name="irrigationmethod"]').closest(".radio-group"), validate: validateIrrigationMethod },
  { el: byId("regdate"), validate: validateDate },
  { el: byId("farmphoto"), validate: validatePhoto }
];

// Run one field's validator and display its result. Returns true if valid.
function checkField(field) {
  var message = field.validate();
  showError(field.el, message);
  return message === "";
}

// Validate as the user moves through the form.
fields.forEach(function (field) {
  var el = field.el;
  var validatesOnChange = el.classList.contains("radio-group") ||
    el.tagName === "SELECT" || el.type === "file" || el.type === "date";

  if (validatesOnChange) {
    el.addEventListener("change", function () { checkField(field); });
  } else {
    el.addEventListener("blur", function () { checkField(field); });
    // Once flagged, clear the error as soon as the user fixes it.
    el.addEventListener("input", function () {
      if (el.classList.contains("invalid")) checkField(field);
    });
  }
});

// ---- Submit handling ----
function handleSubmit(event) {
  event.preventDefault(); // never let an unchecked form submit
  successBox.hidden = true;

  var firstInvalid = null;
  fields.forEach(function (field) {
    var ok = checkField(field);
    if (!ok && firstInvalid === null) firstInvalid = field.el;
  });

  if (firstInvalid !== null) {
    var target = firstInvalid.classList.contains("radio-group")
      ? firstInvalid.querySelector("input")
      : firstInvalid;
    target.focus();
    return; // invalid: stop here, errors are on screen
  }

  // Valid. There is no backend yet, so confirm on the page.
  successBox.textContent = "Thank you, " + byId("name").value.trim() +
    "! Your registration has been submitted.";
  successBox.hidden = false;
  form.reset();
  successBox.scrollIntoView({ behavior: "smooth", block: "start" });
}

form.addEventListener("submit", handleSubmit);
