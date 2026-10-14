// Live 3-day forecast for the farm, from Open-Meteo (free, no API key).
// Sample location: Karad, Maharashtra. Change FARM to the real farm location.
// The two iframes in weather.html use the same coordinates.
var FARM = { name: "Karad, Maharashtra", lat: 17.2894, lon: 74.182 };

// WMO weather codes returned by Open-Meteo
var WEATHER_CODES = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Rime fog",
  51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain",
  80: "Light showers", 81: "Showers", 82: "Violent showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with heavy hail"
};

var forecastBox = document.getElementById("forecast");
var hintBox = document.getElementById("forecast-hint");

function describeWeather(code) {
  return WEATHER_CODES[code] || "Unknown";
}

function formatDay(isoDate) {
  var d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function makeCell(tag, text) {
  var cell = document.createElement(tag);
  cell.textContent = text;
  return cell;
}

function buildTable(daily) {
  var table = document.createElement("table");

  var caption = document.createElement("caption");
  caption.textContent = "Forecast for " + FARM.name;
  table.appendChild(caption);

  var headRow = document.createElement("tr");
  ["Day", "Conditions", "Temp (°C)", "Rain (mm / chance)", "ET₀ (mm)", "Wind (km/h)"].forEach(function (title) {
    headRow.appendChild(makeCell("th", title));
  });
  var thead = document.createElement("thead");
  thead.appendChild(headRow);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");
  daily.time.forEach(function (day, i) {
    var row = document.createElement("tr");
    row.appendChild(makeCell("td", i === 0 ? "Today" : formatDay(day)));
    row.appendChild(makeCell("td", describeWeather(daily.weathercode[i])));
    row.appendChild(makeCell("td", Math.round(daily.temperature_2m_min[i]) + " – " + Math.round(daily.temperature_2m_max[i])));
    row.appendChild(makeCell("td", daily.precipitation_sum[i] + " / " + daily.precipitation_probability_max[i] + "%"));
    row.appendChild(makeCell("td", daily.et0_fao_evapotranspiration[i]));
    row.appendChild(makeCell("td", Math.round(daily.windspeed_10m_max[i])));
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  return table;
}

// A simple irrigation tip based on today's rain.
function irrigationHint(daily) {
  var rainMm = daily.precipitation_sum[0];
  var chance = daily.precipitation_probability_max[0];
  if (rainMm >= 5 || chance >= 70) {
    return "Rain is likely today (" + rainMm + " mm, " + chance + "% chance). Consider postponing irrigation.";
  }
  return "No significant rain expected today. Follow the irrigation advisory.";
}

function showForecast(data) {
  forecastBox.textContent = "";
  forecastBox.appendChild(buildTable(data.daily));
  hintBox.textContent = irrigationHint(data.daily);
}

function showError() {
  forecastBox.textContent = "The forecast could not be loaded right now. Check your internet connection and reload the page.";
}

function loadForecast() {
  var url = "https://api.open-meteo.com/v1/forecast" +
    "?latitude=" + FARM.lat + "&longitude=" + FARM.lon +
    "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum," +
    "precipitation_probability_max,et0_fao_evapotranspiration,windspeed_10m_max" +
    "&timezone=auto&forecast_days=3";

  fetch(url)
    .then(function (response) {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then(showForecast)
    .catch(showError);
}

loadForecast();
