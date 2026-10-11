// Aether - sign in first, then show the main content for the chosen city.
// All weather values are demonstration data (no live API yet).

// ---------- data ----------
const DOT = {
  'Good': '#2E9E5B',
  'Satisfactory': '#8BB92E',
  'Moderate': '#E0B400',
  'Poor': '#E8832A',
  'Very Poor': '#D43F3A',
  'Severe': '#8E1B2E'
};

const ICONS = {
  sun: 'icons/sun.png',
  cloud: 'icons/cloud.png',
  storm: 'icons/storm.png',
  rain: 'icons/rain.png'
};

// name, temp (C), conditions, humidity %, wind km/h, AQI, CPCB category
const CITIES = [
  ['Delhi', 29, 'Hazy sunshine', 48, 8, 215, 'Poor'],
  ['Mumbai', 31, 'Partly cloudy', 70, 14, 98, 'Satisfactory'],
  ['Bengaluru', 25, 'Light showers', 80, 12, 62, 'Satisfactory'],
  ['Chennai', 30, 'Humid and cloudy', 75, 15, 85, 'Satisfactory'],
  ['Kolkata', 30, 'Mostly cloudy', 78, 10, 130, 'Moderate'],
  ['Hyderabad', 28, 'Chance of thunderstorm', 70, 11, 90, 'Satisfactory'],
  ['Pune', 27, 'Cloudy', 65, 9, 70, 'Satisfactory'],
  ['Ahmedabad', 32, 'Sunny', 45, 13, 120, 'Moderate'],
  ['Jaipur', 31, 'Sunny', 40, 10, 150, 'Moderate'],
  ['Lucknow', 30, 'Haze', 55, 7, 190, 'Moderate'],
  ['Bhopal', 28, 'Partly cloudy', 60, 8, 75, 'Satisfactory'],
  ['Indore', 28, 'Mostly clear', 58, 9, 68, 'Satisfactory']
].map(([name, temp, desc, hum, wind, aqi, cat]) => ({ name, temp, desc, hum, wind, aqi, cat }));

// name, temp, conditions, AQI, category, PM2.5, PM10, note
const BETTER = [
  ['Shimla', 17, 'Partly cloudy', 38, 'Good', 15, 38, 'Cool hill-station example with a low sample AQI.'],
  ['Bengaluru', 25, 'Light showers', 62, 'Satisfactory', 24, 62, 'Large-city example where rain may help clear particles from the air.'],
  ['Indore', 28, 'Mostly clear', 68, 'Satisfactory', 28, 68, 'Central India example with clear skies.'],
  ['Pune', 27, 'Cloudy', 70, 'Satisfactory', 30, 70, 'Western India example with cloud cover.'],
  ['Bhopal', 28, 'Partly cloudy', 75, 'Satisfactory', 32, 75, 'Central India example with mild weather.']
];

const LEGEND = [
  ['0 - 50', 'Good', 'Minimal impact.', 'Minimal impact.'],
  ['51 - 100', 'Satisfactory', 'Minor breathing discomfort to sensitive people.', 'May cause minor breathing discomfort to sensitive people.'],
  ['101 - 200', 'Moderate', 'Discomfort to people with lung or heart disease, children and older adults.', 'May cause breathing discomfort to people with lung disease such as asthma, and to people with heart disease, children and older adults.'],
  ['201 - 300', 'Poor', 'Discomfort to most people on prolonged exposure.', 'May cause breathing discomfort to most people on prolonged exposure, and discomfort to people with heart disease.'],
  ['301 - 400', 'Very Poor', 'Respiratory illness on prolonged exposure.', 'May cause respiratory illness on prolonged exposure.'],
  ['401 - 500', 'Severe', 'Affects healthy people and seriously affects those with existing diseases.', 'May affect healthy people and seriously affect those with existing diseases.']
];

// date, day, conditions, min, max, rain %, wind  (Delhi pattern; shifted per city)
const FORECAST_BASE = [
  ['11 Oct', 'Sunday', null, 20, 31, 5, 'Light, NW, 8 km/h'],
  ['12 Oct', 'Monday', 'Sunny', 20, 32, 5, 'Light, NW, 10 km/h'],
  ['13 Oct', 'Tuesday', 'Partly cloudy', 21, 32, 10, 'Light, W, 10 km/h'],
  ['14 Oct', 'Wednesday', 'Cloudy', 21, 30, 20, 'Moderate, SE, 14 km/h'],
  ['15 Oct', 'Thursday', 'Light rain', 20, 28, 55, 'Moderate, SE, 16 km/h'],
  ['16 Oct', 'Friday', 'Thunderstorms', 20, 27, 65, 'Gusty, up to 35 km/h'],
  ['17 Oct', 'Saturday', 'Partly cloudy', 19, 29, 15, 'Light, NW, 9 km/h']
];

const ALERTS = [
  ['Heavy rainfall', 'Heavy to very heavy rain is possible in some areas. Avoid flooded roads and low-lying places.'],
  ['Thunderstorms', 'Thunderstorms with lightning and gusty winds are possible. Stay indoors and away from open fields and tall isolated trees.'],
  ['Heatwaves', 'Very high daytime temperatures are possible. Drink water regularly and limit outdoor activity at midday.'],
  ['Cold waves', 'Temperatures may fall well below normal. Wear warm layers and protect children and older adults.'],
  ['Strong winds', 'Strong winds may damage loose objects and trees. Secure outdoor items and avoid unsafe structures.'],
  ['Cyclones', 'A cyclonic storm may bring very strong winds, heavy rain and rough seas to coastal areas. Follow official instructions and avoid the coast.'],
  ['Poor air quality', 'Air quality may be poor for several days. Sensitive people may wish to limit prolonged outdoor effort.']
];

const TIPS = [
  ['Planning travel around rain', ['Check the rain forecast before you leave.', 'Leave extra time on rainy days, as roads can flood and traffic slows.', 'Carry an umbrella or raincoat if rain is possible.']],
  ['Staying comfortable in extreme temperatures', ['In extreme heat: drink water often, wear light clothing and avoid strenuous activity at midday.', 'In cold weather: wear layers and keep your head and hands covered.', 'Check on children and older adults.']],
  ['Interpreting local AQI readings', ['Use a nearby monitoring station and note the time of the reading.', 'Check which AQI standard is used. This page uses CPCB.', 'When the AQI is high, consider shorter or lighter outdoor activity.']],
  ['Checking official warnings', ['Look at IMD advisories before long trips and outdoor events.', 'Follow instructions from local authorities during severe weather.']],
  ['Planning outdoor activities', ['Match the activity to the weather and plan a backup.', 'Choose cooler hours of the day for exercise in warm weather.', 'Avoid open areas during thunderstorms.']],
  ['Understanding seasonal weather', ['India has winter, summer, the monsoon and the post-monsoon transition.', 'Local forecasts matter more than national averages.', 'Air pollution often changes with the season as well.']]
];

const SNAPSHOT = [
  ['Cities in the dashboard', '12', 'The cities in the weather and AQI table.'],
  ['Elevated example AQI (above 100)', '5', 'Delhi, Kolkata, Ahmedabad, Jaipur, Lucknow.'],
  ['Lowest example AQI', '38', 'Shimla, lowest across all example locations.'],
  ['Highest example temperature', '32 °C', 'Ahmedabad, highest in the 12-city table.']
];

const SOURCES = [
  ['IMD', 'https://mausam.imd.gov.in/', 'Forecasts and warnings'],
  ['CPCB', 'https://cpcb.nic.in/', 'Air quality standards'],
  ['CPCB National AQI', 'https://airquality.cpcb.gov.in/AQI_India/', 'Current AQI by station'],
  ['SAFAR', 'https://safar.tropmet.res.in/', 'Air quality forecasts for major cities'],
  ['NDMA', 'https://ndma.gov.in/', 'Disaster preparedness'],
  ['MoEFCC', 'https://moef.gov.in/', 'Environmental information'],
  ['Down To Earth', 'https://www.downtoearth.org.in/', 'Environment and climate news'],
  ['OpenStreetMap', 'https://www.openstreetmap.org/', 'Map service used by the map links']
];

const VIEWS = [
  ['home', 'Home', null],
  ['map', 'Map', 'Example weather and AQI for 12 cities, with the CPCB legend.'],
  ['cleaner', 'Cleaner air', 'Five example places with lower AQI readings.'],
  ['forecast', 'Forecast', 'Your seven-day outlook.'],
  ['air', 'Air quality', 'What AQI, PM2.5 and PM10 mean, and the CPCB categories.'],
  ['alerts', 'Alerts and tips', 'Example warnings and everyday weather tips.'],
  ['about', 'About', 'Data sources, limitations and official resources.']
];

// ---------- state ----------
const state = { name: '', email: '', city: 'Delhi', view: 'signin' };

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const osm = (name) => 'https://www.openstreetmap.org/search?query=' + encodeURIComponent(name + ', India');

// Pick an icon from the conditions text.
function iconFor(desc) {
  const t = (desc || '').toLowerCase();
  if (t.includes('thunder')) return ICONS.storm;
  if (t.includes('rain') || t.includes('shower')) return ICONS.rain;
  if (t.includes('cloud') || t === 'haze') return ICONS.cloud;
  return ICONS.sun;
}

function currentCity() {
  return CITIES.find((c) => c.name === state.city) || CITIES[0];
}

// Delhi's pattern shifted by the city's example temperature.
function forecastFor(city) {
  const delta = city.temp - 29;
  return FORECAST_BASE.map(([date, day, cond, min, max, rain, wind]) => ({
    date, day, rain, wind,
    cond: cond || city.desc,
    min: min + delta,
    max: max + delta
  }));
}

// ---------- static fills (run once) ----------
function fillCitySelects() {
  const options = CITIES.map((c) => `<option value="${c.name}">${c.name}</option>`).join('');
  $('f-city').innerHTML = options;
  $('header-city').innerHTML = options;
}

function fillNav() {
  $('main-nav').innerHTML = VIEWS.map(([id, label]) => `<button type="button" data-view="${id}">${label}</button>`).join('');
}

function fillStatic() {
  $('tiles').innerHTML = VIEWS.slice(1).map(([id, label, desc]) =>
    `<button type="button" class="tile" data-go="${id}"><span class="tile-title">${label}</span><span class="tile-desc">${desc}</span></button>`).join('');

  $('snapshot').innerHTML = SNAPSHOT.map(([label, value, detail]) =>
    `<article class="stat-card"><div class="label">${label}</div><div class="value">${value}</div><div class="detail">${detail}</div></article>`).join('');

  $('legend').innerHTML = LEGEND.map(([range, name, meaning]) =>
    `<div class="legend-card"><div class="name"><span class="dot" style="background:${DOT[name]}"></span>${name}</div><div class="range">AQI ${range}</div><div class="meaning">${meaning}</div></div>`).join('');

  $('health-rows').innerHTML = LEGEND.map(([range, name, , impact]) =>
    `<tr><td>${range}</td><th scope="row"><span class="cell-aqi"><span class="dot sm" style="background:${DOT[name]}"></span>${name}</span></th><td class="muted">${impact}</td></tr>`).join('');

  $('better').innerHTML = BETTER.map(([name, temp, cond, aqi, cat, pm25, pm10, note]) =>
    `<article class="place">
      <div class="place-head"><h3>${name}</h3><span><b>${temp} °C</b></span></div>
      <div class="muted small">${cond}</div>
      <div class="place-aqi"><span class="dot" style="background:${DOT[cat]}"></span><b>${aqi}</b><span class="muted">${cat}</span></div>
      <div class="place-pm"><span><span class="muted">PM2.5</span> ${pm25}</span><span><span class="muted">PM10</span> ${pm10}</span></div>
      <p class="muted small" style="margin:0">${note}</p>
      <a href="${osm(name)}" target="_blank" rel="noopener noreferrer">Open on the map</a>
    </article>`).join('');

  $('alerts').innerHTML = ALERTS.map(([title, text]) =>
    `<details><summary>${title} <span class="muted" style="font-weight:400">(example)</span></summary><p class="muted">${text}</p></details>`).join('');

  $('tips').innerHTML = TIPS.map(([title, items]) =>
    `<article class="card pad tip"><h3>${title}</h3><ul class="muted">${items.map((i) => `<li>${i}</li>`).join('')}</ul></article>`).join('');

  $('sources').innerHTML = SOURCES.map(([name, href, note]) =>
    `<li><a href="${href}" target="_blank" rel="noopener noreferrer">${name}</a><span class="muted small">${note}</span></li>`).join('');
}

// ---------- fills that depend on the chosen city ----------
function renderCityViews() {
  const city = currentCity();
  const forecast = forecastFor(city);

  // Home report
  $('home-welcome').textContent = 'Welcome, ' + state.name;
  $('home-city').textContent = city.name;
  $('home-temp').textContent = city.temp + '°';
  $('home-cond').textContent = city.desc;
  $('home-icon').src = iconFor(city.desc);
  $('home-forecast-btn').textContent = 'See the forecast for ' + city.name;
  $('home-stats').innerHTML = [
    ['Humidity', city.hum + ' %'],
    ['Wind', city.wind + ' km/h'],
    ['Rain chance today', forecast[0].rain + ' %']
  ].map(([l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join('');
  $('home-aqi').innerHTML = `<span class="dot" style="background:${DOT[city.cat]}"></span><strong>AQI ${city.aqi}</strong><span class="muted">${city.cat} (CPCB)</span>`;

  // Forecast cards
  $('forecast-title').textContent = 'Seven-day forecast, ' + city.name;
  $('forecast-cards').innerHTML = forecast.map((f) =>
    `<article class="day">
      <div><div class="dname">${f.day}</div><div class="muted small">${f.date}</div></div>
      <img src="${iconFor(f.cond)}" alt="" width="44" height="44">
      <div class="dcond">${f.cond}</div>
      <div class="temps"><span class="tmax">${f.max}°</span> <span class="muted">${f.min}°</span></div>
      <div class="bar"><div style="width:${f.rain}%"></div></div>
      <div class="muted small">Rain chance ${f.rain} %</div>
      <div class="muted small">${esc(f.wind)}</div>
    </article>`).join('');

  // Map table (your city highlighted)
  $('city-rows').innerHTML = CITIES.map((c) =>
    `<tr class="${c.name === state.city ? 'mine' : ''}">
      <th scope="row">${c.name}</th>
      <td>${c.temp} °C</td><td>${c.desc}</td><td>${c.hum} %</td><td>${c.wind} km/h</td>
      <td><span class="cell-aqi"><span class="dot sm" style="background:${DOT[c.cat]}"></span><b>${c.aqi}</b><span class="muted">${c.cat}</span></span></td>
      <td><a href="${osm(c.name)}" target="_blank" rel="noopener noreferrer">Open</a></td>
    </tr>`).join('');

  $('header-city').value = state.city;
}

// ---------- views ----------
function showView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach((el) => { el.hidden = el.id !== 'view-' + view; });
  const signedIn = view !== 'signin';
  $('header-tools').hidden = !signedIn;
  document.querySelectorAll('#main-nav button').forEach((b) => {
    b.classList.toggle('active', b.dataset.view === view);
  });
  window.scrollTo(0, 0);
}

// ---------- events ----------
$('signin-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.target;
  state.name = form.name.value.trim() || 'there';
  state.email = form.email.value.trim();
  state.city = form.city.value;
  form.password.value = ''; // the password is never kept
  renderCityViews();
  showView('home');
});

$('header-city').addEventListener('change', (e) => {
  state.city = e.target.value;
  renderCityViews();
});

$('sign-out').addEventListener('click', () => {
  state.name = '';
  state.email = '';
  state.city = 'Delhi';
  $('signin-form').reset();
  showView('signin');
});

$('main-nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-view]');
  if (b) showView(b.dataset.view);
});

// Any element with data-go jumps to that view (hero buttons, tiles)
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-go]');
  if (el) showView(el.dataset.go);
});

// ---------- start ----------
fillCitySelects();
fillNav();
fillStatic();
showView('signin');
