export async function getLocations(apiKey, key, cb) {
  try {
    let results = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${key}`);
    let resJSON = await results.json();
    let options = resJSON.map((loc) => `<option value="${loc.name}, ${loc.region}">`);
    console.log(options);
    return cb(options.join(''));
  } catch (error) {
    console.log('There was an error fetching locations');
  }
}

export async function getWeather(apiKey, loc) {
  try {
    let results = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=5&aqi=no&alerts=no`);
    let resJSON = await results.json();
    return Promise.resolve(resJSON);
  } catch (error) {
    console.log('There was an error fetching the weather data');
  }
}
