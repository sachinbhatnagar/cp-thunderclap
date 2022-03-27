const resultsEl = document.querySelector('#results');
const onloadTitle = document.querySelector('#onload-title');
const currentBg = document.querySelector('#current');
const currentTemp = document.querySelector('#temp');
const currentCondition = document.querySelector('#condition');
const currentIcon = document.querySelector('#current-icon > img');
const pressure = document.querySelector('#pressure');
const visibility = document.querySelector('#visibility');
const wind = document.querySelector('#wind');
const humidityEl = document.querySelector('#humidity');
const forecast = document.querySelector('#forecast');

function setBg(temp) {
  if (temp < 10) {
    return 'cold';
  } else if (temp > 10 && temp < 25) {
    return 'warm';
  } else {
    return 'hot';
  }
}

function unhideUI() {
  resultsEl.classList.remove('hide');
  onloadTitle.style.display = 'none';
}

function forecastTemplate(date, icon) {
  const localDate = new Date(date);
  const formattedDate = Intl.DateTimeFormat('en-IN').format(localDate);
  return `<div>
  <div class="date">${formattedDate.replace(/\//g, '-')}</div>
  <div class="icon"><img src="${icon}" alt="" /></div>
</div>`;
}

export function currentWeather(data) {
  let {
    temp_c,
    condition: { text, icon },
    pressure_mb,
    vis_km,
    wind_kph,
    humidity,
  } = data.weather.current;
  currentTemp.innerText = `${temp_c}°c`;
  currentCondition.innerText = text;
  currentIcon.setAttribute('src', icon.replace('64x64', '128x128'));
  pressure.innerText = `${pressure_mb}mb`;
  visibility.innerText = `${vis_km}kms`;
  wind.innerText = `${wind_kph}kph`;
  humidityEl.innerText = `${humidity}%`;
  currentBg.setAttribute('class', setBg(temp_c));
  unhideUI();
}

export function forecastWeather(data) {
  let { forecastday } = data.weather.forecast;
  let content = forecastday.map(
    ({
      date,
      day: {
        condition: { icon },
      },
    }) => forecastTemplate(date, icon.replace('64x64', '128x128'))
  );

  forecast.innerHTML = content.join('');
}
