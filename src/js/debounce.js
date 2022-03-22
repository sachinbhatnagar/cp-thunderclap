export default function debounce(fn, delay = 500) {
  let timer;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...arguments), delay);
  };
}
