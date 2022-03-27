export function getLocations(apiKey, key, cb) {
  return fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${key}`)
    .then((res) => res.json())
    .then((res) => cb(res));
}

export function getWeather(apiKey, loc) {
  return fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=5&aqi=no&alerts=no`).then((res) => res.json());
}
