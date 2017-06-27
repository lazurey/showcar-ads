var waitUntilAdsCanBeLoaded = function () {
    return new Promise(function (resolve, reject) {
        var loc = window.location;
        var cookie = document.cookie;
        var adsAreDisabled = loc.href.indexOf('ads-off=true') >= 0;
        var isUserDealer = cookie.indexOf('CustomerType=D') >= 0;
        var isTest = cookie.indexOf('testrun=true') >= 0;
        var onDetailPageDE = loc.host == 'www.autoscout24.de' && loc.href.indexOf('/angebote/') >= 0;

        if (adsAreDisabled || (isUserDealer && !onDetailPageDE) || isTest) {
            reject();
            return;
        }

        var needToWaitForCookieConsent = function () {
            var host = loc.hostname;
            var cookieConsentNeeded = /\.(nl|it)$/.test(host) || (loc.hash.indexOf('cookie-consent-needed') >= 0);
            var cookieConsentGiven = cookie.indexOf('cookieConsent=1;') >= 0;
            return cookieConsentNeeded && !cookieConsentGiven;
        };

        if (needToWaitForCookieConsent()) {
            window.addEventListener('cookie-consent-given', resolve);
        } else {
            resolve();
        }
    });
};


var uuid = function () {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

var getAttribute = function (el, attributeName, fallback) {
    return (el && el.getAttribute && el.getAttribute(attributeName)) || fallback;
};

var hasAttribute = function (el, attributeName) {
    return el && el.hasAttribute(attributeName);
};

var setAttribute = function (el, attributeName, value) {
    return el && el.setAttribute(attributeName, value);
};

var removeAttribute = function (el, attributeName) {
    return el && el.removeAttribute(attributeName);
};

var loadScript = function (url) {
    var script = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    script.src = url;
    s.parentNode.insertBefore(script, s);
};

var ready = function () {
    return new Promise(function (resolve) {
        if (document.readyState !== 'loading') {
            return resolve();
        }

        document.addEventListener('DOMContentLoaded', resolve);
    });
};

var isElementInViewport = function (element) {
    if (!element || !document.body.contains(element)) { return false; }
    var rect = element.getBoundingClientRect();
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    return rect.top >= 0
        && rect.top < windowHeight
        && rect.left >= 0
        && rect.left < windowWidth;
};

var addCss = function (ruleText) {
    var el = document.createElement('style');
    el.innerHTML = ruleText;
    document.querySelector('head').appendChild(el);
};

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$1;



var isObject$2 = Object.freeze({
	default: isObject_1,
	__moduleExports: isObject_1
});

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;



var _freeGlobal$2 = Object.freeze({
	default: _freeGlobal,
	__moduleExports: _freeGlobal
});

var require$$0 = ( _freeGlobal$2 && _freeGlobal$2['default'] ) || _freeGlobal$2;

var freeGlobal = require$$0;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

var _root = root$1;



var _root$2 = Object.freeze({
	default: _root,
	__moduleExports: _root
});

var require$$0$1 = ( _root$2 && _root$2['default'] ) || _root$2;

var root = require$$0$1;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function() {
  return root.Date.now();
};

var now_1 = now$1;



var now$2 = Object.freeze({
	default: now_1,
	__moduleExports: now_1
});

var root$2 = require$$0$1;

/** Built-in value references. */
var Symbol$1 = root$2.Symbol;

var _Symbol = Symbol$1;



var _Symbol$2 = Object.freeze({
	default: _Symbol,
	__moduleExports: _Symbol
});

var require$$0$2 = ( _Symbol$2 && _Symbol$2['default'] ) || _Symbol$2;

var Symbol$2 = require$$0$2;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;



var _getRawTag$2 = Object.freeze({
	default: _getRawTag,
	__moduleExports: _getRawTag
});

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString$1;



var _objectToString$2 = Object.freeze({
	default: _objectToString,
	__moduleExports: _objectToString
});

var require$$1 = ( _getRawTag$2 && _getRawTag$2['default'] ) || _getRawTag$2;

var require$$0$3 = ( _objectToString$2 && _objectToString$2['default'] ) || _objectToString$2;

var Symbol = require$$0$2;
var getRawTag = require$$1;
var objectToString = require$$0$3;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$1;



var _baseGetTag$2 = Object.freeze({
	default: _baseGetTag,
	__moduleExports: _baseGetTag
});

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$1;



var isObjectLike$2 = Object.freeze({
	default: isObjectLike_1,
	__moduleExports: isObjectLike_1
});

var require$$1$1 = ( _baseGetTag$2 && _baseGetTag$2['default'] ) || _baseGetTag$2;

var require$$0$4 = ( isObjectLike$2 && isObjectLike$2['default'] ) || isObjectLike$2;

var baseGetTag = require$$1$1;
var isObjectLike = require$$0$4;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol$1;



var isSymbol$2 = Object.freeze({
	default: isSymbol_1,
	__moduleExports: isSymbol_1
});

var require$$1$2 = ( isObject$2 && isObject$2['default'] ) || isObject$2;

var require$$0$5 = ( isSymbol$2 && isSymbol$2['default'] ) || isSymbol$2;

var isObject$3 = require$$1$2;
var isSymbol = require$$0$5;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$3(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$3(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;



var toNumber$2 = Object.freeze({
	default: toNumber_1,
	__moduleExports: toNumber_1
});

var require$$1$3 = ( now$2 && now$2['default'] ) || now$2;

var require$$0$6 = ( toNumber$2 && toNumber$2['default'] ) || toNumber$2;

var isObject = require$$1$2;
var now = require$$1$3;
var toNumber = require$$0$6;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;
var nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1$1 = debounce;

var gt$1 = function () { return window.googletag || (window.googletag = { cmd: [] }); };

var slotsCache = {};

var destroyAdSlotById = function (id) {
    var slot = slotsCache[id].slot;
    gt$1().cmd.push(function () { return gt$1().destroySlots([slot]); });
};

var refreshAdSlotById = function (id) {
    var x = slotsCache[id];
    if (x) {
        x.waitsForRefresh = true;
        refreshAdslotsWaitingToBeRefreshed();
    }
};

var register = function (ref) {
    var adunit = ref.adunit;
    var container = ref.container;
    var outOfPage = ref.outOfPage;
    var sizeMapping = ref.sizeMapping;
    var slotElement = ref.slotElement;
    var immediate = ref.immediate;
    var collapseEmpty = ref.collapseEmpty;
    var openxIgnore = ref.openxIgnore;

    var id = uuid();

    var ret = {
        refresh: function () { return refreshAdSlotById(id); },
        destroy: function () { return destroyAdSlotById(id); }
    };

    slotsCache[id] = {
        ret: ret,
        container: container,
        slotElement: slotElement
    };

    gt$1().cmd.push(function () {
        var pubads = gt$1().pubads();
        var slot = outOfPage
                        ? gt$1().defineOutOfPageSlot(adunit, container.id).addService(pubads)
                        : gt$1().defineSlot(adunit, [], container.id).defineSizeMapping(sizeMapping).addService(pubads);

        if(collapseEmpty) {
            slot.setCollapseEmptyDiv(true);
        }

        gt$1().display(container.id);

        slotsCache[id].slot = slot;
        slotsCache[id].outOfPage = outOfPage;
        slotsCache[id].immediate = immediate;
        slotsCache[id].openxIgnore = openxIgnore;

        refreshAdSlotById(id);


    });

    return ret;
};

var refreshOxBids = false;

var refreshAdslotsWaitingToBeRefreshed = debounce_1$1(function () {
    var slotsToRefresh = [];

    Object.keys(slotsCache).forEach(function (id) {
        var x = slotsCache[id];

        if (x.waitsForRefresh && (x.outOfPage || isElementInViewport(x.slotElement) || x.immediate)) {
            slotsToRefresh.push(x);
            x.waitsForRefresh = false;
            x.ret.onrefresh && x.ret.onrefresh();
        }
    });

    if (slotsToRefresh.length > 0) {
        gt$1().cmd.push(function () {
            var usingOpenX = window.OX && window.OX.dfp_bidder && window.OX.dfp_bidder.refresh && window.OX.dfp_bidder.setOxTargeting;

            var openxSlotsToRefresh = slotsToRefresh.filter(function (s) { return !s.openxIgnore; }).map(function (s) { return s.slot; });
            var allSlotsToRefresh = slotsToRefresh.map(function (s) { return s.slot; });

            if (usingOpenX) {
                if (refreshOxBids) {
                    var onrefresh = function () {
                        window.OX.dfp_bidder.setOxTargeting(openxSlotsToRefresh);
                        gt$1().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
                    };

                    var to = setTimeout(function () { onrefresh(); }, 1500);

                    window.OX.dfp_bidder.refresh(function () {
                        clearTimeout(to);
                        onrefresh();
                    }, openxSlotsToRefresh);
                } else {
                    refreshOxBids = true;
                    window.OX.dfp_bidder.setOxTargeting(openxSlotsToRefresh);
                    gt$1().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
                }

                return;
            }

            gt$1().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
        });
    }
}, 50);

var findXIdByGptSlot = function (slot) {
    var xs = Object.keys(slotsCache).filter(function (id) {
        return slotsCache[id].slot === slot;
    }).map(function (id) { return slotsCache[id]; });

    return xs.length ? xs[0] : null;
};

gt$1().cmd.push(function () {
    var pubads = gt$1().pubads();

    pubads.addEventListener('slotRenderEnded', function (eventData) {
        var x = findXIdByGptSlot(eventData.slot);

        if (eventData.isEmpty) {
            x && x.ret.onempty && x.ret.onempty();
        }
        else {
            x && x.ret.onload && x.ret.onload();
        }
    });
});

window.addEventListener('load', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('scroll', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('animationend', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('transitionend', refreshAdslotsWaitingToBeRefreshed);

var gptinit = function () {
    gt$1().cmd.push(function () {
        var pubads = gt$1().pubads();
        pubads.enableSingleRequest();
        pubads.disableInitialLoad();
        gt$1().enableServices();
    });
};

/**
 * Gets the first element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias first
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the first element of `array`.
 * @example
 *
 * _.head([1, 2, 3]);
 * // => 1
 *
 * _.head([]);
 * // => undefined
 */
function head(array) {
  return (array && array.length) ? array[0] : undefined;
}

var head_1 = head;



var head$1 = Object.freeze({
	default: head_1,
	__moduleExports: head_1
});

var require$$0$7 = ( head$1 && head$1['default'] ) || head$1;

var first = require$$0$7;

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

var last_1 = last;

var parseResolution = function (str) {
    if (/fluid/.test(str)) {
        return 'fluid';
    }

    var matches = str.replace(/[\s]/g, '').match(/([\d]+)x([\d]+)/i);

    if (matches && matches[2]) {
        return [matches[1] | 0, matches[2] | 0];
    }

    return null;
};

var parseAttributes = function (attributes) {

    return Array.from(attributes).filter(function (x) {
        return /size-map-/.test(x.nodeName);
    }).map(function (x) {
        return [
            parseResolution(x.nodeName),
            x.value.split(',').map(parseResolution).filter(function (x) { return x === 'fluid' || (Array.isArray(x) && x.length === 2); })
        ];
    });
};

var consolidateSizeMapping = function (mapping) {
    var ensureMappingHas0x0Mapping = function (m) {
        var lastElement = last_1(m);

        if (!lastElement || lastElement[0][0] !== 0 || lastElement[0][1] !== 0) {
            mapping.push([[0, 0],[]]);
        }

        return mapping;
    };

    var sortedMapping = mapping.sort(function (x, y) {
        return (y[0][0] - x[0][0]) || (y[0][1] - x[0][1]);
    });

    var mappingWith0x0Mapping = ensureMappingHas0x0Mapping(sortedMapping);

    return mappingWith0x0Mapping;
};

var getEligibleSizesForResolution = function (mapping, resolution) {
    var fe =  first(mapping.filter(function (x) { return (x === 'fluid') || (x[0][0] <= resolution.x && x[0][1] <= resolution.y); }));
    return (fe && fe[1]) || [];
};

var parseAttributesIntoValidMapping = function (attributes) {
    var x1 = parseAttributes(attributes);
    var x2 = consolidateSizeMapping(x1);

    return x2;
};

var styles = "as24-ad-slot{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}as24-ad-slot>div{display:inline-block;margin:0 auto}as24-ad-slot{background-image:url(data:image/svg+xml;charset=utf-8,%3Csvg%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22141.7%22%20height%3D%2270.7%22%20viewBox%3D%220%200%20141.7%2070.7%22%3E%3Cstyle%3E%3C%21%5BCDATA%5B%0D%0A%09.st0%7Bfill%3A%23FFFFFF%3B%7D%0D%0A%5D%5D%3E%3C%2Fstyle%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M14.7%2061.4h-.2c-2.8%200-5.2-1.9-5.2-5.2%200-2%203-2%203%200%200%201.4.9%202.2%202.2%202.2h.2c1.3%200%202.3-.7%202.3-2%200-3.2-7.5-3.5-7.5-8.3v-.5c0-2.8%202.8-4.4%205-4.4h.2c2.7%200%205%201.7%205%204.1%200%201.9-3%202-3%20.1%200-.7-.8-1.2-2.1-1.2h-.2c-1.1%200-2%20.6-2%201.6v.4c0%202%207.5%202.9%207.5%208.3.1%202.9-2.2%204.9-5.2%204.9zM27.7%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8.1c0-2.9%202.3-5%205.2-5h.2c2.6%200%204.8%201.8%205.1%204.3v.3c0%20.9-.8%201.4-1.5%201.4s-1.3-.4-1.4-1.3c-.2-1.1-1.1-1.8-2.2-1.8h-.2c-1.2%200-2.2.9-2.2%202.1v8.1c0%201.2%201%202.1%202.2%202.1h.2c1.1%200%202-.7%202.2-1.8.1-.9.8-1.3%201.4-1.3.8%200%201.5.5%201.5%201.4v.3c-.3%202.6-2.5%204.4-5.1%204.4zM40.4%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c-.1%202.9-2.4%205.1-5.2%205.1zm2.2-13.1c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1h.2c1.2%200%202.2-.9%202.2-2.1v-8zM54%2061.4h-.2c-2.8%200-5.2-2.3-5.2-5.2V44.8c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V44.8c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v11.5c0%202.8-2.3%205.1-5.2%205.1zM69.8%2046.4h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V46.4h-2.1c-1%200-1.5-.7-1.5-1.5%200-.7.5-1.5%201.5-1.5h7.1c1%200%201.5.7%201.5%201.5.1.7-.4%201.5-1.4%201.5zM83.7%2061.2H77c-1%200-1.5-.9-1.5-1.8%200-.3.1-.6.2-.9l5.9-9.4c.3-.5.3-.8.3-1.2v-.2c0-.8-.7-1.5-1.5-1.5h-.1c-.9%200-1.5.7-1.5%201.5v.3c0%201-.8%201.5-1.5%201.5s-1.5-.5-1.5-1.5v-.4c0-2.5%202-4.3%204.5-4.3h.1c2.4%200%204.5%201.8%204.5%204.3v.3c0%201-.4%201.8-.9%202.7l-4.7%207.7h4.5c1%200%201.5.7%201.5%201.5-.1.7-.6%201.4-1.6%201.4zM95.5%2057.7h-.6v2.2c0%201-.7%201.5-1.5%201.5s-1.4-.5-1.4-1.5v-2.2h-4.1c-1%200-1.7-.6-1.7-1.6%200-.3.1-.6.2-.8l4.8-11.2c.3-.6.8-.9%201.3-.9.8%200%201.5.6%201.5%201.4%200%20.2%200%20.4-.1.6l-4.3%209.4H92v-1.5c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v1.5h.6c1%200%201.5.7%201.5%201.5s-.6%201.6-1.6%201.6zM16.3%2014.6l-1.7%205.5h3.3zM54.7%2024.3h.2c1.2%200%202.2-.9%202.2-2.1v-8c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1z%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M0%200v70.7h123.3c10.1%200%2018.4-8.2%2018.4-18.3V0H0zm49.5%2014.2c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c0%202.9-2.3%205.1-5.2%205.1h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8zm-10.4-5h7.1c1%200%201.5.7%201.5%201.5%200%20.7-.5%201.5-1.5%201.5h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V12.2H39c-1%200-1.5-.8-1.5-1.5.1-.7.6-1.5%201.6-1.5zm-14.3%201.4c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V10.6c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%202.8-2.3%205.2-5.2%205.2H30c-2.8%200-5.2-2.3-5.2-5.2V10.6zM9.9%2025.3l4.7-14.9c.4-1.2%201-1.3%201.7-1.3.6%200%201.3.1%201.7%201.3l4.7%2014.9c.1.2.1.3.1.5%200%20.9-.8%201.4-1.5%201.4-.6%200-1.2-.3-1.4-1.1l-1-3.1h-5.1l-1%203.1c-.2.7-.8%201.1-1.4%201.1-.8%200-1.5-.6-1.5-1.4-.1-.2-.1-.3%200-.5zm129.6%2027.2c0%208.7-7.2%2016-16.2%2016H2.2V35.3h137.3v17.2z%22%2F%3E%3C%2Fsvg%3E);background-size:70px 35px;background-position:center center;background-repeat:no-repeat;position:relative}as24-ad-slot[out-of-page],.sc-ads-no-placeholder,.sc-ads-silent-placeholder,as24-ad-slot[loaded]:not([empty]){background-image:none}.sc-ads-silent-placeholder>div{box-shadow:inset 0 0 1px #cdcdcd}.sc-ads-silent-placeholder[loaded]:not([empty])>div{box-shadow:none}as24-ad-slot[loaded][ad-label]:not([empty]):before{content:attr(ad-label);position:absolute;top:-17px;display:inline-block;font-size:0.8125rem}\n";

var registerElement = function (name) {
    if ( name === void 0 ) name = 'as24-ad-slot';


    var AS24AdSlotPrototype = Object.create(HTMLElement.prototype, {
        attachedCallback: {
            value: function() {
                var this$1 = this;

                var pageResolution = {
                    x: window.innerWidth,
                    y: window.innerHeight
                };

                var sizeMapping = parseAttributesIntoValidMapping(this.attributes);
                var eligibleSizes = getEligibleSizesForResolution(sizeMapping, pageResolution);
                var hasEligibleSizes = eligibleSizes && eligibleSizes.length > 0;

                setAttribute(this, 'size-mapping', JSON.stringify(sizeMapping));
                setAttribute(this, 'sizes', JSON.stringify(eligibleSizes));

                if (!hasEligibleSizes) {
                    setAttribute(this, 'empty', '');
                    this.dispatchEvent(new Event('ad-slot-empty'), { bubbles: true });

                    return;
                }

                var elementId = getAttribute(this, 'element-id') || ("ad-" + (uuid()));
                var adunit = getAttribute(this, 'ad-unit');
                var outOfPage = hasAttribute(this, 'out-of-page');
                var immediate = hasAttribute(this, 'immediate');
                var collapseEmpty = hasAttribute(this, 'collapse-empty');
                var openxIgnore = hasAttribute(this, 'openx-ignore');

                var container = this.container = document.createElement('div');
                container.id = elementId;
                this.appendChild(container);

                if (!collapseEmpty) {
                    var sizes = eligibleSizes.filter(function (s) { return s !== 'fluid'; }).sort(function (a, b) { return a[1] - b[1]; });
                    var minHeight = sizes[0][1];
                    var minWidth = sizes[0][0];

                    container.style.minHeight = this.style.minHeight = minHeight + "px";
                    container.style.minWidth = this.style.minWidth = minWidth + "px";
                }

                this.adslot = register({
                    adunit: adunit,
                    outOfPage: outOfPage,
                    sizeMapping: sizeMapping,
                    container: container,
                    slotElement: this,
                    immediate: immediate,
                    collapseEmpty: collapseEmpty,
                    openxIgnore: openxIgnore
                });


                this.adslot.onempty = function () {
                    setAttribute(this$1, 'empty', '');
                    this$1.dispatchEvent(new Event('ad-slot-empty'), { bubbles: true });
                };

                this.adslot.onload = function () {
                    setAttribute(this$1, 'loaded', '');
                    this$1.className += " rnd-" + ((Math.random() * 10000) | 0); // this causes redraw in IE, because attribute change doesn't
                    this$1.dispatchEvent(new Event('ad-slot-loaded'), { bubbles: true });

                    if (!collapseEmpty) {
                        var oldMinHeight = parseInt(this$1.style.minHeight, 10);
                        var height = container.clientHeight;
                        var oldMinWidth = parseInt(this$1.style.minWidth, 10);
                        var width = container.clientWidth;
                        this$1.style.minHeight = (Math.max(oldMinHeight, height)) + "px";
                        this$1.style.minWidth = (Math.max(oldMinWidth, width)) + "px";
                    }
                };

                this.adslot.onrefresh = function () {
                    removeAttribute(this$1, 'loaded');
                    removeAttribute(this$1, 'empty');
                };

            }
        },

        detachedCallback: {
            value: function() {
                if (this.adslot) {
                    this.adslot.destroy();
                }
            }
        },
        refreshAdSlot: {
            value: function() {
                if (this.adslot) {
                    this.container.innerHTML = '';
                    this.adslot.refresh();
                }
            }
        }
    });

    var stylesForCurrentTagName = styles.replace(/as24-ad-slot/g, name);
    addCss(stylesForCurrentTagName);

    document.registerElement(name, { prototype: AS24AdSlotPrototype });
};

var registerElement$1 = function (name) {
    if ( name === void 0 ) name = 'as24-ad-targeting';

    var googletag = window.googletag || (window.googletag = { cmd: [] });

    var AS24AdTargetingPrototype = Object.create(HTMLElement.prototype,  {

        attachedCallback: {
            value: function() {
                this.refreshTargeting();
            }
        },

        detachedCallback: {
            value: function() {
                this.refreshTargeting();
            }
        },

        refreshTargeting: {
            value: function() {
                var targetingElements = Array.from(document.querySelectorAll(name) || []);
                var targetingObjects = targetingElements.map(function (el) { return JSON.parse(el.innerHTML.trim() || '{}'); });
                var targeting = {};

                targetingObjects.forEach(function (obj) { return Object.assign(targeting, obj); });

                googletag.cmd.push(function () {
                    var pubads = googletag.pubads();
                    var oldTargetingKeys = pubads.getTargetingKeys();

                    oldTargetingKeys.forEach(function (key) { return pubads.clearTargeting(key); });

                    for (var key in targeting) {
                        var value = ("" + (targeting[key])).split(',');
                        pubads.setTargeting(key, value);
                    }

                    if (window.Krux) {
                        pubads.setTargeting('ksg', window.Krux.segments);
                        pubads.setTargeting('kuid', window.Krux.user);
                    }
                });
            }
        }
    });

    addCss((name + "{display:none}"));
    document.registerElement(name, { prototype: AS24AdTargetingPrototype });
};

waitUntilAdsCanBeLoaded()
    .then(ready)
    .then(function () {
        gptinit();
        registerElement();
        registerElement$1();
    })
    // .then(() => {
    //     const configElement = document.querySelector('as24-ad-config');
    //     const config = {};
    //     Array.from(configElement.attributes).forEach(x => {
    //         config[x.nodeName] = x.nodeValue;
    //     });

    //     return config;
    // })
    .then(function () {
        var tld = location.hostname.split('.').pop();
        var useOpenX = tld === 'de' || tld === 'at' || location.hash.indexOf('ads-use-openx') >= 0;
        var getOpenxUrl = function (tld) {
            var urls = {
                de: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout',
                at: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-at'
            };

            return urls[tld] || urls['de'];
        };

        if (!useOpenX) {
            loadScript('https://www.googletagservices.com/tag/js/gpt.js');
        }

        if (useOpenX) {
            var convertSizes = function (sizes) {
                return JSON.parse(sizes).filter(function (x) { return Array.isArray(x) && x.length === 2; }).map(function (x) { return x.join('x'); });
            };

            var activeSlots = Array.from(document.querySelectorAll('as24-ad-slot[sizes]:not([sizes="[]"]):not([out-of-page]):not([immediate]):not([openx-ignore])'));

            window.OX_dfp_ads = activeSlots.map(function (element) { return [element.getAttribute('ad-unit'), convertSizes(element.getAttribute('sizes')), element.children[0].id]; });
            loadScript(getOpenxUrl(tld));

            var oxTimeout;
            var oxCallback = function () {
                clearTimeout(oxTimeout);
                loadScript('https://www.googletagservices.com/tag/js/gpt.js');
            };

            oxTimeout = setTimeout(oxCallback, 3000);
            window.OX_dfp_options = { callback: oxCallback };
        }
    })
    .catch(function (e) {
        console.warn(e);
    });
