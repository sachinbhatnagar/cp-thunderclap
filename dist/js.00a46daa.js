// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/actions.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocations = getLocations;
exports.getWeather = getWeather;

function getLocations(apiKey, key, cb) {
  return fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${key}`).then(res => res.json()).then(res => cb(res));
}

function getWeather(apiKey, loc) {
  return fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${loc}&days=5&aqi=no&alerts=no`).then(res => res.json());
}
},{}],"js/debounce.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = debounce;

function debounce(fn, delay = 500) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), delay);
  };
}
},{}],"js/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const fnArr = [];

class State {
  constructor(obj) {
    this.data = new Proxy(obj = {}, {
      get(target) {
        return target;
      },

      set(obj, prop, value) {
        obj[prop] = value;
        fnArr.forEach(fn => fn.call(null, obj));
        return true;
      }

    });
  }

  get state() {
    return this.data;
  }

  registerViewHandler(fn) {
    fnArr.push(fn);
  }

}

exports.default = State;
},{}],"js/view.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.currentWeather = currentWeather;
exports.forecastWeather = forecastWeather;
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

function currentWeather(data) {
  let {
    temp_c,
    condition: {
      text,
      icon
    },
    pressure_mb,
    vis_km,
    wind_kph,
    humidity
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

function forecastWeather(data) {
  let {
    forecastday
  } = data.weather.forecast;
  let content = forecastday.map(({
    date,
    day: {
      condition: {
        icon
      }
    }
  }) => forecastTemplate(date, icon.replace('64x64', '128x128')));
  forecast.innerHTML = content.join('');
}
},{}],"js/index.js":[function(require,module,exports) {
"use strict";

var _actions = require("./actions");

var _debounce = _interopRequireDefault(require("./debounce"));

var _state = _interopRequireDefault(require("./state"));

var _view = require("./view");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Write your code here...
const API_KEY = '1771e80ec84d432889d51008221603';
const search = document.querySelector('#search');
const locationsList = document.querySelector('#locations');
const getLocs = (0, _debounce.default)(_actions.getLocations);
let {
  state,
  registerViewHandler
} = new _state.default();
registerViewHandler(_view.currentWeather);
registerViewHandler(_view.forecastWeather);
search.addEventListener('input', evt => {
  evt.preventDefault();

  if (evt.inputType === 'insertText') {
    getLocs(API_KEY, evt.target.value, res => {
      let remappedLocations = res.map(({
        name,
        region
      }) => `<option value="${name}, ${region}">`).join('');
      locationsList.innerHTML = remappedLocations;
    });
  } else if (evt.target.value !== '' && evt.inputType !== 'deleteContentBackward') {
    (0, _actions.getWeather)(API_KEY, evt.target.value).then(result => state.weather = result);
  }
});
},{"./actions":"js/actions.js","./debounce":"js/debounce.js","./state":"js/state.js","./view":"js/view.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50345" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/index.js"], null)
//# sourceMappingURL=/js.00a46daa.js.map