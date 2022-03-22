// Write your code here...
import { getLocations, getWeather } from './actions';
import debounce from './debounce';

const API_KEY = '<your weather API key>';
const search = document.querySelector('#search');
const locationsList = document.querySelector('#locations');
const getLocs = debounce(getLocations);

search.addEventListener('input', (evt) => {
  evt.preventDefault();

  if (evt.inputType === 'insertText') {
    getLocs(API_KEY, evt.target.value, (res) => (locationsList.innerHTML = res));
  } else if (evt.target.value !== '' && evt.inputType !== 'deleteContentBackward') {
    getWeather(API_KEY, evt.target.value).then((res) => console.log(res));
  }
});
