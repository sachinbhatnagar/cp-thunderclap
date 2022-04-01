const fnArr = [];

export default class State {
  constructor(obj) {
    this.data = new Proxy((obj = {}), {
      get(target) {
        return target;
      },
      set(obj, prop, value) {
        obj[prop] = value;
        // Run my own functions which will update my UI
        fnArr.forEach((fn) => fn.call(null, obj));
        return true;
      },
    });
  }
  get state() {
    return this.data;
  }
  registerViewHandler(fn) {
    fnArr.push(fn);
  }
}
