// Write your code here...
import { getLocations, getWeather } from './actions';
import debounce from './debounce';

const API_KEY = '1771e80ec84d432889d51008221603';
const search = document.querySelector('#search');
const locationsList = document.querySelector('#locations');
const getLocs = debounce(getLocations, 800);

search.addEventListener('input', (evt) => {
  evt.preventDefault();

  if (evt.inputType === 'insertText') {
    getLocs(API_KEY, evt.target.value, (res) => {
      let remapLocs = res.map(({ name, region }) => `<option value="${name}, ${region}">`);
      locationsList.innerHTML = remapLocs.join('');
    });
  } else if (evt.target.value !== '' && evt.inputType !== 'deleteContentBackward') {
    getWeather(API_KEY, evt.target.value).then((res) => console.log(res));
  }
});
