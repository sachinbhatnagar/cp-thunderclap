const fnArr = [];

export default class State {
  constructor(obj) {
    this.data = new Proxy((obj = {}), {
      get(target) {
        return target;
      },
      set(obj, prop, value) {
        obj[prop] = value;
        fnArr.forEach((fn) => fn.call(null, obj));
        return true;
      },
    });
  }
  registerViewHandler(fn) {
    fnArr.push(fn);
  }
}
