// Write your code here...
import { getLocations, getWeather } from './actions';
import debounce from './debounce';
import State from './state';
import { currentWeather, forecastWeather } from './view';

const API_KEY = '1771e80ec84d432889d51008221603';
const search = document.querySelector('#search');
const locationsList = document.querySelector('#locations');
const getLocs = debounce(getLocations);
let { state, registerViewHandler } = new State();

registerViewHandler(currentWeather);
registerViewHandler(forecastWeather);

search.addEventListener('input', (evt) => {
  evt.preventDefault();

  if (evt.inputType === 'insertText') {
    getLocs(API_KEY, evt.target.value, (res) => {
      let remappedLocations = res.map(({ name, region }) => `<option value="${name}, ${region}">`).join('');
      locationsList.innerHTML = remappedLocations;
    });
  } else if (evt.target.value !== '' && evt.inputType !== 'deleteContentBackward') {
    getWeather(API_KEY, evt.target.value).then((result) => (state.weather = result));
  }
});
