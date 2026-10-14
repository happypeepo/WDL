// Fills the Minimum / Maximum / Average rows of the sensor data table.
// Each numeric column's cells carry a class (col-moisture, col-ph, ...),
// so the lookup still works with the rowspan'd Weather cells.

// Column name -> text added after each summary value
var COLUMN_UNITS = {
  moisture: "",
  ph: "",
  potassium: "",
  water: " mm"
};

// Reads every number in one column of the table body.
function getColumnValues(column) {
  var cells = document.querySelectorAll("tbody td.col-" + column);
  var values = [];
  cells.forEach(function (cell) {
    var number = parseFloat(cell.textContent); // "40 mm" -> 40
    if (!isNaN(number)) values.push(number);
  });
  return values;
}

// Smallest value in the list (null if the list is empty).
function calculateMinimum(values) {
  if (values.length === 0) return null;
  var min = values[0];
  for (var i = 1; i < values.length; i++) {
    if (values[i] < min) min = values[i];
  }
  return min;
}

// Largest value in the list (null if the list is empty).
function calculateMaximum(values) {
  if (values.length === 0) return null;
  var max = values[0];
  for (var i = 1; i < values.length; i++) {
    if (values[i] > max) max = values[i];
  }
  return max;
}

// Mean of the list (null if the list is empty).
function calculateAverage(values) {
  if (values.length === 0) return null;
  var sum = 0;
  for (var i = 0; i < values.length; i++) {
    sum += values[i];
  }
  return sum / values.length;
}

// Writes one summary value into its footer cell, e.g. id="min-ph".
function showSummary(cellId, value, unit, decimals) {
  var cell = document.getElementById(cellId);
  if (value === null) return; // no data: leave the dash
  cell.textContent = value.toFixed(decimals) + unit;
}

function fillSummaryRows() {
  Object.keys(COLUMN_UNITS).forEach(function (column) {
    var values = getColumnValues(column);
    var unit = COLUMN_UNITS[column];
    var decimals = column === "ph" ? 1 : 0; // pH is reported to one decimal

    showSummary("min-" + column, calculateMinimum(values), unit, decimals);
    showSummary("max-" + column, calculateMaximum(values), unit, decimals);
    showSummary("avg-" + column, calculateAverage(values), unit, 2);
  });
}

fillSummaryRows();
