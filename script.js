
	$(document).ready(function(){


		/* ---- Countdown timer ---- */

		$('#counter').countdown({
			timestamp : (new Date()).getTime() + 11*24*60*60*1000
		});


		/* ---- Animations ---- */

		$('#links a').hover(
			function(){ $(this).animate({ left: 3 }, 'fast'); },
			function(){ $(this).animate({ left: 0 }, 'fast'); }
		);

		$('footer a').hover(
			function(){ $(this).animate({ top: 3 }, 'fast'); },
			function(){ $(this).animate({ top: 0 }, 'fast'); }
		);
	});


	;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


	var toString = Object.prototype.toString;
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	// Array.isArray is supported in IE9
	function isArray(xs) {
	  return toString.call(xs) === '[object Array]';
	}
	exports.isArray = typeof Array.isArray === 'function' ? Array.isArray : isArray;

	// Array.prototype.indexOf is supported in IE9
	exports.indexOf = function indexOf(xs, x) {
	  if (xs.indexOf) return xs.indexOf(x);
	  for (var i = 0; i < xs.length; i++) {
	    if (x === xs[i]) return i;
	  }
	  return -1;
	};

	// Array.prototype.filter is supported in IE9
	exports.filter = function filter(xs, fn) {
	  if (xs.filter) return xs.filter(fn);
	  var res = [];
	  for (var i = 0; i < xs.length; i++) {
	    if (fn(xs[i], i, xs)) res.push(xs[i]);
	  }
	  return res;
	};

	// Array.prototype.forEach is supported in IE9
	exports.forEach = function forEach(xs, fn, self) {
	  if (xs.forEach) return xs.forEach(fn, self);
	  for (var i = 0; i < xs.length; i++) {
	    fn.call(self, xs[i], i, xs);
	  }
	};

	// Array.prototype.map is supported in IE9
	exports.map = function map(xs, fn) {
	  if (xs.map) return xs.map(fn);
	  var out = new Array(xs.length);
	  for (var i = 0; i < xs.length; i++) {
	    out[i] = fn(xs[i], i, xs);
	  }
	  return out;
	};

	// Array.prototype.reduce is supported in IE9
	exports.reduce = function reduce(array, callback, opt_initialValue) {
	  if (array.reduce) return array.reduce(callback, opt_initialValue);
	  var value, isValueSet = false;

	  if (2 < arguments.length) {
	    value = opt_initialValue;
	    isValueSet = true;
	  }
	  for (var i = 0, l = array.length; l > i; ++i) {
	    if (array.hasOwnProperty(i)) {
	      if (isValueSet) {
	        value = callback(value, array[i], i, array);
	      }
	      else {
	        value = array[i];
	        isValueSet = true;
	      }
	    }
	  }

	  return value;
	};

	// String.prototype.substr - negative index don't work in IE8
	if ('ab'.substr(-1) !== 'b') {
	  exports.substr = function (str, start, length) {
	    // did we get a negative start, calculate how much it is from the beginning of the string
	    if (start < 0) start = str.length + start;

	    // call the original function
	    return str.substr(start, length);
	  };
	} else {
	  exports.substr = function (str, start, length) {
	    return str.substr(start, length);
	  };
	}

	// String.prototype.trim is supported in IE9
	exports.trim = function (str) {
	  if (str.trim) return str.trim();
	  return str.replace(/^\s+|\s+$/g, '');
	};

	// Function.prototype.bind is supported in IE9
	exports.bind = function () {
	  var args = Array.prototype.slice.call(arguments);
	  var fn = args.shift();
	  if (fn.bind) return fn.bind.apply(fn, args);
	  var self = args.shift();
	  return function () {
	    fn.apply(self, args.concat([Array.prototype.slice.call(arguments)]));
	  };
	};

	// Object.create is supported in IE9
	function create(prototype, properties) {
	  var object;
	  if (prototype === null) {
	    object = { '__proto__' : null };
	  }
	  else {
	    if (typeof prototype !== 'object') {
	      throw new TypeError(
	        'typeof prototype[' + (typeof prototype) + '] != \'object\''
	      );
	    }
	    var Type = function () {};
	    Type.prototype = prototype;
	    object = new Type();
	    object.__proto__ = prototype;
	  }
	  if (typeof properties !== 'undefined' && Object.defineProperties) {
	    Object.defineProperties(object, properties);
	  }
	  return object;
	}
	exports.create = typeof Object.create === 'function' ? Object.create : create;

	// Object.keys and Object.getOwnPropertyNames is supported in IE9 however
	// they do show a description and number property on Error objects
	function notObject(object) {
	  return ((typeof object != "object" && typeof object != "function") || object === null);
	}

	function keysShim(object) {
	  if (notObject(object)) {
	    throw new TypeError("Object.keys called on a non-object");
	  }

	  var result = [];
	  for (var name in object) {
	    if (hasOwnProperty.call(object, name)) {
	      result.push(name);
	    }
	  }
	  return result;
	}

	// getOwnPropertyNames is almost the same as Object.keys one key feature
	//  is that it returns hidden properties, since that can't be implemented,
	//  this feature gets reduced so it just shows the length property on arrays
	function propertyShim(object) {
	  if (notObject(object)) {
	    throw new TypeError("Object.getOwnPropertyNames called on a non-object");
	  }

	  var result = keysShim(object);
	  if (exports.isArray(object) && exports.indexOf(object, 'length') === -1) {
	    result.push('length');
	  }
	  return result;
	}

	var keys = typeof Object.keys === 'function' ? Object.keys : keysShim;
	var getOwnPropertyNames = typeof Object.getOwnPropertyNames === 'function' ?
	  Object.getOwnPropertyNames : propertyShim;

	if (new Error().hasOwnProperty('description')) {
	  var ERROR_PROPERTY_FILTER = function (obj, array) {
	    if (toString.call(obj) === '[object Error]') {
	      array = exports.filter(array, function (name) {
	        return name !== 'description' && name !== 'number' && name !== 'message';
	      });
	    }
	    return array;
	  };

	  exports.keys = function (object) {
	    return ERROR_PROPERTY_FILTER(object, keys(object));
	  };
	  exports.getOwnPropertyNames = function (object) {
	    return ERROR_PROPERTY_FILTER(object, getOwnPropertyNames(object));
	  };
	} else {
	  exports.keys = keys;
	  exports.getOwnPropertyNames = getOwnPropertyNames;
	}

	// Object.getOwnPropertyDescriptor - supported in IE8 but only on dom elements
	function valueObject(value, key) {
	  return { value: value[key] };
	}

	if (typeof Object.getOwnPropertyDescriptor === 'function') {
	  try {
	    Object.getOwnPropertyDescriptor({'a': 1}, 'a');
	    exports.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	  } catch (e) {
	    // IE8 dom element issue - use a try catch and default to valueObject
	    exports.getOwnPropertyDescriptor = function (value, key) {
	      try {
	        return Object.getOwnPropertyDescriptor(value, key);
	      } catch (e) {
	        return valueObject(value, key);
	      }
	    };
	  }
	} else {
	  exports.getOwnPropertyDescriptor = valueObject;
	}

	},{}],2:[function(require,module,exports){

	// not implemented
	// The reason for having an empty file and not throwing is to allow
	// untraditional implementation of this module.

	},{}],3:[function(require,module,exports){
	var process=require("__browserify_process");

	var util = require('util');
	var shims = require('_shims');

	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }

	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }

	  return parts;
	}

	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};

	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;

	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();

	    // Skip empty and invalid entries
	    if (!util.isString(path)) {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }

	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }

	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)

	  // Normalize the path
	  resolvedPath = normalizeArray(shims.filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');

	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};

	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = shims.substr(path, -1) === '/';

	  // Normalize the path
	  path = normalizeArray(shims.filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }

	  return (isAbsolute ? '/' : '') + path;
	};

	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};

	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(shims.filter(paths, function(p, index) {
	    if (!util.isString(p)) {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};


	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);

	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }

	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }

	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }

	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));

	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }

	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }

	  outputParts = outputParts.concat(toParts.slice(samePartsLength));

	  return outputParts.join('/');
	};

	exports.sep = '/';
	exports.delimiter = ':';

	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];

	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }

	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }

	  return root + dir;
	};


	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};


	exports.extname = function(path) {
	  return splitPath(path)[3];
	};

	},{"__browserify_process":5,"_shims":1,"util":4}],4:[function(require,module,exports){

	var shims = require('_shims');

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};

	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  shims.forEach(array, function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = shims.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = shims.getOwnPropertyNames(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }

	  shims.forEach(keys, function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = shims.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }

	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (shims.indexOf(ctx.seen, desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = shims.reduce(output, function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return shims.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) && objectToString(e) === '[object Error]';
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.binarySlice === 'function'
	  ;
	}
	exports.isBuffer = isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = function(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = shims.create(superCtor.prototype, {
	    constructor: {
	      value: ctor,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	};

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = shims.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	},{"_shims":1}],5:[function(require,module,exports){
	// shim for using process in browser

	var process = module.exports = {};

	process.nextTick = (function () {
	    var canSetImmediate = typeof window !== 'undefined'
	    && window.setImmediate;
	    var canPost = typeof window !== 'undefined'
	    && window.postMessage && window.addEventListener
	    ;

	    if (canSetImmediate) {
	        return function (f) { return window.setImmediate(f) };
	    }

	    if (canPost) {
	        var queue = [];
	        window.addEventListener('message', function (ev) {
	            var source = ev.source;
	            if ((source === window || source === null) && ev.data === 'process-tick') {
	                ev.stopPropagation();
	                if (queue.length > 0) {
	                    var fn = queue.shift();
	                    fn();
	                }
	            }
	        }, true);

	        return function nextTick(fn) {
	            queue.push(fn);
	            window.postMessage('process-tick', '*');
	        };
	    }

	    return function nextTick(fn) {
	        setTimeout(fn, 0);
	    };
	})();

	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	}

	// TODO(shtylman)
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};

	},{}],6:[function(require,module,exports){

	/*!
	 * EJS
	 * Copyright(c) 2012 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Module dependencies.
	 */

	var utils = require('./utils')
	  , path = require('path')
	  , dirname = path.dirname
	  , extname = path.extname
	  , join = path.join
	  , fs = require('fs')
	  , read = fs.readFileSync;

	/**
	 * Filters.
	 *
	 * @type Object
	 */

	var filters = exports.filters = require('./filters');


	var cache = {};

	exports.clearCache = function(){
	  cache = {};
	};


	function filtered(js) {
	  return js.substr(1).split('|').reduce(function(js, filter){
	    var parts = filter.split(':')
	      , name = parts.shift()
	      , args = parts.join(':') || '';
	    if (args) args = ', ' + args;
	    return 'filters.' + name + '(' + js + args + ')';
	  });
	};

	function rethrow(err, str, filename, lineno){
	  var lines = str.split('\n')
	    , start = Math.max(lineno - 3, 0)
	    , end = Math.min(lines.length, lineno + 3);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? ' >> ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'ejs') + ':'
	    + lineno + '\n'
	    + context + '\n\n'
	    + err.message;
	  
	  throw err;
	}


	var parse = exports.parse = function(str, options){
	  var options = options || {}
	    , open = options.open || exports.open || '<%'
	    , close = options.close || exports.close || '%>'
	    , filename = options.filename
	    , compileDebug = options.compileDebug !== false
	    , buf = "";

	  buf += 'var buf = [];';
	  if (false !== options._with) buf += '\nwith (locals || {}) { (function(){ ';
	  buf += '\n buf.push(\'';

	  var lineno = 1;

	  var consumeEOL = false;
	  for (var i = 0, len = str.length; i < len; ++i) {
	    var stri = str[i];
	    if (str.slice(i, open.length + i) == open) {
	      i += open.length
	  
	      var prefix, postfix, line = (compileDebug ? '__stack.lineno=' : '') + lineno;
	      switch (str[i]) {
	        case '=':
	          prefix = "', escape((" + line + ', ';
	          postfix = ")), '";
	          ++i;
	          break;
	        case '-':
	          prefix = "', (" + line + ', ';
	          postfix = "), '";
	          ++i;
	          break;
	        default:
	          prefix = "');" + line + ';';
	          postfix = "; buf.push('";
	      }

	      var end = str.indexOf(close, i)
	        , js = str.substring(i, end)
	        , start = i
	        , include = null
	        , n = 0;

	      if ('-' == js[js.length-1]){
	        js = js.substring(0, js.length - 2);
	        consumeEOL = true;
	      }

	      if (0 == js.trim().indexOf('include')) {
	        var name = js.trim().slice(7).trim();
	        if (!filename) throw new Error('filename option is required for includes');
	        var path = resolveInclude(name, filename);
	        include = read(path, 'utf8');
	        include = exports.parse(include, { filename: path, _with: false, open: open, close: close, compileDebug: compileDebug });
	        buf += "' + (function(){" + include + "})() + '";
	        js = '';
	      }

	      while (~(n = js.indexOf("\n", n))) n++, lineno++;
	      if (js.substr(0, 1) == ':') js = filtered(js);
	      if (js) {
	        if (js.lastIndexOf('//') > js.lastIndexOf('\n')) js += '\n';
	        buf += prefix;
	        buf += js;
	        buf += postfix;
	      }
	      i += end - start + close.length - 1;

	    } else if (stri == "\\") {
	      buf += "\\\\";
	    } else if (stri == "'") {
	      buf += "\\'";
	    } else if (stri == "\r") {
	      // ignore
	    } else if (stri == "\n") {
	      if (consumeEOL) {
	        consumeEOL = false;
	      } else {
	        buf += "\\n";
	        lineno++;
	      }
	    } else {
	      buf += stri;
	    }
	  }

	  if (false !== options._with) buf += "'); })();\n} \nreturn buf.join('');";
	  else buf += "');\nreturn buf.join('');";
	  return buf;
	};

	/**
	 * Compile the given `str` of ejs into a `Function`.
	 *
	 * @param {String} str
	 * @param {Object} options
	 * @return {Function}
	 * @api public
	 */

	var compile = exports.compile = function(str, options){
	  options = options || {};
	  var escape = options.escape || utils.escape;
	  
	  var input = JSON.stringify(str)
	    , compileDebug = options.compileDebug !== false
	    , client = options.client
	    , filename = options.filename
	        ? JSON.stringify(options.filename)
	        : 'undefined';
	  
	  if (compileDebug) {
	    // Adds the fancy stack trace meta info
	    str = [
	      'var __stack = { lineno: 1, input: ' + input + ', filename: ' + filename + ' };',
	      rethrow.toString(),
	      'try {',
	      exports.parse(str, options),
	      '} catch (err) {',
	      '  rethrow(err, __stack.input, __stack.filename, __stack.lineno);',
	      '}'
	    ].join("\n");
	  } else {
	    str = exports.parse(str, options);
	  }
	  
	  if (options.debug) console.log(str);
	  if (client) str = 'escape = escape || ' + escape.toString() + ';\n' + str;

	  try {
	    var fn = new Function('locals, filters, escape, rethrow', str);
	  } catch (err) {
	    if ('SyntaxError' == err.name) {
	      err.message += options.filename
	        ? ' in ' + filename
	        : ' while compiling ejs';
	    }
	    throw err;
	  }

	  if (client) return fn;

	  return function(locals){
	    return fn.call(this, locals, filters, escape, rethrow);
	  }
	};

	/**
	 * Render the given `str` of ejs.
	 *
	 * Options:
	 *
	 *   - `locals`          Local variables object
	 *   - `cache`           Compiled functions are cached, requires `filename`
	 *   - `filename`        Used by `cache` to key caches
	 *   - `scope`           Function execution context
	 *   - `debug`           Output generated function body
	 *   - `open`            Open tag, defaulting to "<%"
	 *   - `close`           Closing tag, defaulting to "%>"
	 *
	 * @param {String} str
	 * @param {Object} options
	 * @return {String}
	 * @api public
	 */

	exports.render = function(str, options){
	  var fn
	    , options = options || {};

	  if (options.cache) {
	    if (options.filename) {
	      fn = cache[options.filename] || (cache[options.filename] = compile(str, options));
	    } else {
	      throw new Error('"cache" option requires "filename".');
	    }
	  } else {
	    fn = compile(str, options);
	  }

	  options.__proto__ = options.locals;
	  return fn.call(options.scope, options);
	};

	/**
	 * Render an EJS file at the given `path` and callback `fn(err, str)`.
	 *
	 * @param {String} path
	 * @param {Object|Function} options or callback
	 * @param {Function} fn
	 * @api public
	 */

	exports.renderFile = function(path, options, fn){
	  var key = path + ':string';

	  if ('function' == typeof options) {
	    fn = options, options = {};
	  }

	  options.filename = path;

	  var str;
	  try {
	    str = options.cache
	      ? cache[key] || (cache[key] = read(path, 'utf8'))
	      : read(path, 'utf8');
	  } catch (err) {
	    fn(err);
	    return;
	  }
	  fn(null, exports.render(str, options));
	};

	/**
	 * Resolve include `name` relative to `filename`.
	 *
	 * @param {String} name
	 * @param {String} filename
	 * @return {String}
	 * @api private
	 */

	function resolveInclude(name, filename) {
	  var path = join(dirname(filename), name);
	  var ext = extname(name);
	  if (!ext) path += '.ejs';
	  return path;
	}

	// express support

	exports.__express = exports.renderFile;

	/**
	 * Expose to require().
	 */

	if (require.extensions) {
	  require.extensions['.ejs'] = function (module, filename) {
	    filename = filename || module.filename;
	    var options = { filename: filename, client: true }
	      , template = fs.readFileSync(filename).toString()
	      , fn = compile(template, options);
	    module._compile('module.exports = ' + fn.toString() + ';', filename);
	  };
	} else if (require.registerExtension) {
	  require.registerExtension('.ejs', function(src) {
	    return compile(src, {});
	  });
	}

	},{"./filters":7,"./utils":8,"fs":2,"path":3}],7:[function(require,module,exports){
	/*!
	 * EJS - Filters
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * First element of the target `obj`.
	 */

	exports.first = function(obj) {
	  return obj[0];
	};

	/**
	 * Last element of the target `obj`.
	 */

	exports.last = function(obj) {
	  return obj[obj.length - 1];
	};

	/**
	 * Capitalize the first letter of the target `str`.
	 */

	exports.capitalize = function(str){
	  str = String(str);
	  return str[0].toUpperCase() + str.substr(1, str.length);
	};

	/**
	 * Downcase the target `str`.
	 */

	exports.downcase = function(str){
	  return String(str).toLowerCase();
	};

	/**
	 * Uppercase the target `str`.
	 */

	exports.upcase = function(str){
	  return String(str).toUpperCase();
	};

	/**
	 * Sort the target `obj`.
	 */

	exports.sort = function(obj){
	  return Object.create(obj).sort();
	};

	/**
	 * Sort the target `obj` by the given `prop` ascending.
	 */

	exports.sort_by = function(obj, prop){
	  return Object.create(obj).sort(function(a, b){
	    a = a[prop], b = b[prop];
	    if (a > b) return 1;
	    if (a < b) return -1;
	    return 0;
	  });
	};

	/**
	 * Size or length of the target `obj`.
	 */

	exports.size = exports.length = function(obj) {
	  return obj.length;
	};

	/**
	 * Add `a` and `b`.
	 */

	exports.plus = function(a, b){
	  return Number(a) + Number(b);
	};

	/**
	 * Subtract `b` from `a`.
	 */

	exports.minus = function(a, b){
	  return Number(a) - Number(b);
	};

	/**
	 * Multiply `a` by `b`.
	 */

	exports.times = function(a, b){
	  return Number(a) * Number(b);
	};

	/**
	 * Divide `a` by `b`.
	 */

	exports.divided_by = function(a, b){
	  return Number(a) / Number(b);
	};

	/**
	 * Join `obj` with the given `str`.
	 */

	exports.join = function(obj, str){
	  return obj.join(str || ', ');
	};

	/**
	 * Truncate `str` to `len`.
	 */

	exports.truncate = function(str, len, append){
	  str = String(str);
	  if (str.length > len) {
	    str = str.slice(0, len);
	    if (append) str += append;
	  }
	  return str;
	};

	/**
	 * Truncate `str` to `n` words.
	 */

	exports.truncate_words = function(str, n){
	  var str = String(str)
	    , words = str.split(/ +/);
	  return words.slice(0, n).join(' ');
	};

	/**
	 * Replace `pattern` with `substitution` in `str`.
	 */

	exports.replace = function(str, pattern, substitution){
	  return String(str).replace(pattern, substitution || '');
	};

	/**
	 * Prepend `val` to `obj`.
	 */

	exports.prepend = function(obj, val){
	  return Array.isArray(obj)
	    ? [val].concat(obj)
	    : val + obj;
	};

	/**
	 * Append `val` to `obj`.
	 */

	exports.append = function(obj, val){
	  return Array.isArray(obj)
	    ? obj.concat(val)
	    : obj + val;
	};

	/**
	 * Map the given `prop`.
	 */

	exports.map = function(arr, prop){
	  return arr.map(function(obj){
	    return obj[prop];
	  });
	};

	/**
	 * Reverse the given `obj`.
	 */

	exports.reverse = function(obj){
	  return Array.isArray(obj)
	    ? obj.reverse()
	    : String(obj).split('').reverse().join('');
	};

	/**
	 * Get `prop` of the given `obj`.
	 */

	exports.get = function(obj, prop){
	  return obj[prop];
	};

	/**
	 * Packs the given `obj` into json string
	 */
	exports.json = function(obj){
	  return JSON.stringify(obj);
	};

	},{}],8:[function(require,module,exports){

	/*!
	 * EJS
	 * Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
	 * MIT Licensed
	 */

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	exports.escape = function(html){
	  return String(html)
	    .replace(/&(?!#?[a-zA-Z0-9]+;)/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/'/g, '&#39;')
	    .replace(/"/g, '&quot;');
	};
	 

	},{}],9:[function(require,module,exports){
	'use strict';


	var Product = require('./product'),
	    Pubsub = require('./util/pubsub'),
	    Storage = require('./util/storage'),
	    constants = require('./constants'),
	    currency = require('./util/currency'),
	    mixin = require('./util/mixin');



	/**
	 * Renders the Mini Cart to the page's DOM.
	 *
	 * @constructor
	 * @param {string} name Name of the cart (used as a key for storage)
	 * @param {duration} number Time in milliseconds that the cart data should persist
	 */
	function Cart(name, duration) {
	    var data, items, settings, len, i;

	    this._items = [];
	    this._settings = { bn: constants.BN };

	    Pubsub.call(this);
	    Storage.call(this, name, duration);

	    if ((data = this.load())) {
	        items = data.items;
	        settings = data.settings;

	        if (settings) {
	            this._settings = settings;
	        }

	        if (items) {
	            for (i = 0, len = items.length; i < len; i++) {
	                this.add(items[i]);
	            }
	        }
	    }
	}


	mixin(Cart.prototype, Pubsub.prototype);
	mixin(Cart.prototype, Storage.prototype);


	/**
	 * Adds an item to the cart. This fires an "add" event.
	 *
	 * @param {object} data Item data
	 * @return {number} Item location in the cart
	 */
	Cart.prototype.add = function add(data) {
	    var that = this,
	        items = this.items(),
	        idx = false,
	        isExisting = false,
	        product, key, len, i;

	    // Prune cart settings data from the product
	    for (key in data) {
	        if (constants.SETTINGS.test(key)) {
	            this._settings[key] = data[key];
	            delete data[key];
	        }
	    }

	    // Look to see if the same product has already been added
	    for (i = 0, len = items.length; i < len; i++) {
	        if (items[i].isEqual(data)) {
	            product = items[i];
	            product.set('quantity', product.get('quantity') + (parseInt(data.quantity, 10) || 1));
	            idx = i;
	            isExisting = true;
	            break;
	        }
	    }

	    // If not, then try to add it
	    if (!product) {
	        product = new Product(data);

	        if (product.isValid()) {
	            idx = (this._items.push(product) - 1);

	            product.on('change', function (key, value) {
	                that.save();
	                that.fire('change', idx, key, value);
	            });

	            this.save();
	        }
	    }

	    if (product) {
	        this.fire('add', idx, product, isExisting);
	    }

	    return idx;
	};


	/**
	 * Returns the carts current items.
	 *
	 * @param {number} idx (Optional) Returns only that item.
	 * @return {array|object}
	 */
	Cart.prototype.items = function get(idx) {
	    return (typeof idx === 'number') ? this._items[idx] : this._items;
	};


	/**
	 * Returns the carts current settings.
	 *
	 * @param {string} name (Optional) Returns only that setting.
	 * @return {array|string}
	 */
	Cart.prototype.settings = function settings(name) {
	    return (name) ? this._settings[name] : this._settings;
	};


	/**
	 * Returns the cart discount.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Cart.prototype.discount = function discount(config) {
	    var result = parseFloat(this.settings('discount_amount_cart')) || 0;

	    if (!result) {
	        result = (parseFloat(this.settings('discount_rate_cart')) || 0) * this.subtotal() / 100;
	    }

	    config = config || {};
	    config.currency = this.settings('currency_code');

	    return currency(result, config);
	};


	/**
	 * Returns the cart total without discounts.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Cart.prototype.subtotal = function subtotal(config) {
	    var products = this.items(),
	        result = 0,
	        i, len;

	    for (i = 0, len = products.length; i < len; i++) {
	        result += products[i].total();
	    }

	    config = config || {};
	    config.currency = this.settings('currency_code');

	    return currency(result, config);
	};


	/**
	 * Returns the cart total.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Cart.prototype.total = function total(config) {
	    var result = 0;

	    result += this.subtotal();
	    result -= this.discount();

	    config = config || {};
	    config.currency = this.settings('currency_code');

	    return currency(result, config);
	};


	/**
	 * Remove an item from the cart. This fires a "remove" event.
	 *
	 * @param {number} idx Item index to remove.
	 * @return {boolean}
	 */
	Cart.prototype.remove = function remove(idx) {
	    var item = this._items.splice(idx, 1);

	    if (this._items.length === 0) {
	        this.destroy();
	    }

	    if (item) {
	        this.save();
	        this.fire('remove', idx, item[0]);
	    }

	    return !!item.length;
	};


	/**
	 * Saves the cart data.
	 */
	Cart.prototype.save = function save() {
	    var items = this.items(),
	        settings = this.settings(),
	        data = [],
	        i, len;

	    for (i = 0, len = items.length; i < len; i++) {
	        data.push(items[i].get());
	    }

	    Storage.prototype.save.call(this, {
	        items: data,
	        settings: settings
	    });
	};


	/**
	 * Proxies the w3sb_checkout event
	 * The assumption is the view triggers this and consumers subscribe to it
	 *
	 * @param {object} The initiating event
	 */
	Cart.prototype.w3sb_checkout = function w3sb_checkout(evt) {
	    this.fire('w3sb_checkout', evt);
	};


	/**
	 * Destroy the cart data. This fires a "destroy" event.
	 */
	Cart.prototype.destroy = function destroy() {
	    Storage.prototype.destroy.call(this);

	    this._items = [];
	    this._settings = { bn: constants.BN };

	    this.fire('destroy');
	};




	module.exports = Cart;

	},{"./constants":11,"./product":13,"./util/currency":15,"./util/mixin":18,"./util/pubsub":19,"./util/storage":20}],10:[function(require,module,exports){
	'use strict';


	var mixin = require('./util/mixin');


	var defaults = module.exports = {

	    name: 'w3lssbmincart',

	    parent: (typeof document !== 'undefined') ? document.body : null,

	    action: 'products.html',

	    target: '',

	    duration: 30,

	    template: '<%var items = cart.items();var settings = cart.settings();var hasItems = !!items.length;var priceFormat = { format: true, currency: cart.settings("currency_code") };var totalFormat = { format: true, showCode: true };%><form method="post" class="<% if (!hasItems) { %>sbmincart-empty<% } %>" action="<%= config.action %>" target="<%= config.target %>">    <button type="button" class="sbmincart-closer">&times;</button>    <ul>        <% for (var i= 0, idx = i + 1, len = items.length; i < len; i++, idx++) { %>        <li class="sbmincart-item">            <div class="sbmincart-details-name">                <a class="sbmincart-name" href="<%= items[i].get("href") %>"><%= items[i].get("w3ls_item") %></a>                <ul class="sbmincart-attributes">                    <% if (items[i].get("item_number")) { %>                    <li>                        <%= items[i].get("item_number") %>                        <input type="hidden" name="item_number_<%= idx %>" value="<%= items[i].get("item_number") %>" />                    </li>                    <% } %>                    <% if (items[i].discount()) { %>                    <li>                        <%= config.strings.discount %> <%= items[i].discount(priceFormat) %>                        <input type="hidden" name="discount_amount_<%= idx %>" value="<%= items[i].discount() %>" />                    </li>                    <% } %>                    <% for (var options = items[i].options(), j = 0, len2 = options.length; j < len2; j++) { %>                        <li>                            <%= options[j].key %>: <%= options[j].value %>                            <input type="hidden" name="on<%= j %>_<%= idx %>" value="<%= options[j].key %>" />                            <input type="hidden" name="os<%= j %>_<%= idx %>" value="<%= options[j].value %>" />                        </li>                    <% } %>                </ul>            </div>            <div class="sbmincart-details-quantity">                <input class="sbmincart-quantity" data-sbmincart-idx="<%= i %>" name="quantity_<%= idx %>" type="text" pattern="[0-9]*" value="<%= items[i].get("quantity") %>" autocomplete="off" />            </div>            <div class="sbmincart-details-remove">                <button type="button" class="sbmincart-remove" data-sbmincart-idx="<%= i %>">&times;</button>            </div>            <div class="sbmincart-details-price">                <span class="sbmincart-price"><%= items[i].total(priceFormat) %></span>            </div>            <input type="hidden" name="w3ls_item_<%= idx %>" value="<%= items[i].get("w3ls_item") %>" />            <input type="hidden" name="amount_<%= idx %>" value="<%= items[i].amount() %>" />            <input type="hidden" name="shipping_<%= idx %>" value="<%= items[i].get("shipping") %>" />            <input type="hidden" name="shipping2_<%= idx %>" value="<%= items[i].get("shipping2") %>" />        </li>        <% } %>    </ul>    <div class="sbmincart-footer">        <% if (hasItems) { %>            <div class="sbmincart-subtotal">                <%= config.strings.subtotal %> <%= cart.total(totalFormat) %>            </div>            <button class="sbmincart-submit" type="submit" data-sbmincart-alt="<%= config.strings.buttonAlt %>"><%- config.strings.button %></button>        <% } else { %>            <p class="sbmincart-empty-text"><%= config.strings.empty %></p>        <% } %>    </div>    <input type="hidden" name="cmd" value="_cart" />    <input type="hidden" name="upload" value="1" />    <% for (var key in settings) { %>        <input type="hidden" name="<%= key %>" value="<%= settings[key] %>" />    <% } %></form>',

	    styles: '',

	    strings: {
	        button: 'Shop More',
	        subtotal: 'Subtotal:',
	        discount: 'Discount:',
	        empty: 'Your shopping cart is empty'
	    }

	};


	/**
	 * Mixes in the user config with the default config.
	 *
	 * @param {object} userConfig Configuration overrides
	 * @return {object}
	 */
	module.exports.load = function load(userConfig) {
	    return mixin(defaults, userConfig);
	};

	},{"./util/mixin":18}],11:[function(require,module,exports){
	'use strict';


	module.exports = {

	    COMMANDS: { _cart: true, _xclick: true, _donations: true },

	    SETTINGS: /^(?:business|currency_code|lc|paymentaction|no_shipping|cn|no_note|invoice|handling_cart|weight_cart|weight_unit|tax_cart|discount_amount_cart|discount_rate_cart|page_style|image_url|cpp_|cs|cbt|return|cancel_return|notify_url|rm|custom|charset)/,

	    BN: 'sbmincart_AddToCart_WPS_US',

	    KEYUP_TIMEOUT: 500,

	    SHOWING_CLASS: 'sbmincart-showing',

	    REMOVE_CLASS: 'sbmincart-remove',

	    CLOSER_CLASS: 'sbmincart-closer',

	    QUANTITY_CLASS: 'sbmincart-quantity',

	    ITEM_CLASS: 'sbmincart-item',

	    ITEM_CHANGED_CLASS: 'sbmincart-item-changed',

	    SUBMIT_CLASS: 'sbmincart-submit',

	    DATA_IDX: 'data-sbmincart-idx'

	};

	},{}],12:[function(require,module,exports){
	'use strict';


	var Cart = require('./cart'),
	    View = require('./view'),
	    config = require('./config'),
	    sbmincart = {},
	    cartModel,
	    confModel,
	    viewModel;


	/**
	 * Renders the Mini Cart to the page's DOM.
	 *
	 * @param {object} userConfig Configuration overrides
	 */
	sbmincart.render = function (userConfig) {
	    confModel = sbmincart.config = config.load(userConfig);
	    cartModel = sbmincart.cart = new Cart(confModel.name, confModel.duration);
	    viewModel = sbmincart.view = new View({
	        config: confModel,
	        cart: cartModel
	    });

	    cartModel.on('add', viewModel.addItem, viewModel);
	    cartModel.on('change', viewModel.changeItem, viewModel);
	    cartModel.on('remove', viewModel.removeItem, viewModel);
	    cartModel.on('destroy', viewModel.hide, viewModel);
	};


	/**
	 * Resets the Mini Cart and its view model
	 */
	sbmincart.reset = function () {
	    cartModel.destroy();

	    viewModel.hide();
	    viewModel.redraw();
	};




	// Export to either node or the brower window
	if (typeof window === 'undefined') {
	    module.exports = sbmincart;
	} else {
	    if (!window.paypal) {
	        window.paypal = {};
	    }

	    window.w3ls = sbmincart;
	}

	},{"./cart":9,"./config":10,"./view":22}],13:[function(require,module,exports){
	'use strict';


	var currency = require('./util/currency'),
	    Pubsub = require('./util/pubsub'),
	    mixin = require('./util/mixin');


	var parser = {
	    quantity: function (value) {
	        value = parseInt(value, 10);

	        if (isNaN(value) || !value) {
	            value = 1;
	        }

	        return value;
	    },
	    amount: function (value) {
	        return parseFloat(value) || 0;
	    },
	    href: function (value) {
	        if (value) {
	            return value;
	        } else {
	            return (typeof window !== 'undefined') ? window.location.href : null;
	        }
	    }
	};


	/**
	 * Creates a new product.
	 *
	 * @constructor
	 * @param {object} data Item data
	 */
	function Product(data) {
	    data.quantity = parser.quantity(data.quantity);
	    data.amount = parser.amount(data.amount);
	    data.href = parser.href(data.href);

	    this._data = data;
	    this._options = null;
	    this._discount = null;
	    this._amount = null;
	    this._total = null;

	    Pubsub.call(this);
	}


	mixin(Product.prototype, Pubsub.prototype);


	/**
	 * Gets the product data.
	 *
	 * @param {string} key (Optional) A key to restrict the returned data to.
	 * @return {array|string}
	 */
	Product.prototype.get = function get(key) {
	    return (key) ? this._data[key] : this._data;
	};


	/**
	 * Sets a value on the product. This is used rather than manually setting the
	 * value so that we can fire a "change" event.
	 *
	 * @param {string} key
	 * @param {string} value
	 */
	Product.prototype.set = function set(key, value) {
	    var setter = parser[key];

	    this._data[key] = setter ? setter(value) : value;
	    this._options = null;
	    this._discount = null;
	    this._amount = null;
	    this._total = null;

	    this.fire('change', key);
	};


	/**
	 * Parse and return the options for this product.
	 *
	 * @return {object}
	 */
	Product.prototype.options = function options() {
	    var result, key, value, amount, i, j;

	    if (!this._options) {
	        result = [];
	        i = 0;

	        while ((key = this.get('on' + i))) {
	            value = this.get('os' + i);
	            amount = 0;
	            j = 0;

	            while (typeof this.get('option_select' + j) !== 'undefined') {
	                if (this.get('option_select' + j) === value) {
	                    amount = parser.amount(this.get('option_amount' + j));
	                    break;
	                }

	                j++;
	            }

	            result.push({
	                key: key,
	                value: value,
	                amount: amount
	            });

	            i++;
	        }

	        this._options = result;
	    }

	    return this._options;
	};


	/**
	 * Parse and return the discount for this product.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Product.prototype.discount = function discount(config) {
	    var flat, rate, num, limit, result, amount;

	    if (!this._discount) {
	        result = 0;
	        num = parseInt(this.get('discount_num'), 10) || 0;
	        limit = Math.max(num, this.get('quantity') - 1);

	        if (this.get('discount_amount') !== undefined) {
	            flat = parser.amount(this.get('discount_amount'));
	            result += flat;
	            result += parser.amount(this.get('discount_amount2') || flat) * limit;
	        } else if (this.get('discount_rate') !== undefined) {
	            rate = parser.amount(this.get('discount_rate'));
	            amount = this.amount();

	            result += rate * amount / 100;
	            result += parser.amount(this.get('discount_rate2') || rate) * amount * limit / 100;
	        }

	        this._discount = result;
	    }

	    return currency(this._discount, config);
	};


	/**
	 * Parse and return the total without discounts for this product.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Product.prototype.amount = function amount(config) {
	    var result, options, len, i;

	    if (!this._amount) {
	        result = this.get('amount');
	        options = this.options();

	        for (i = 0, len = options.length; i < len; i++) {
	            result += options[i].amount;
	        }

	        this._amount = result;
	    }

	    return currency(this._amount, config);
	};


	/**
	 * Parse and return the total for this product.
	 *
	 * @param {object} config (Optional) Currency formatting options.
	 * @return {number|string}
	 */
	Product.prototype.total = function total(config) {
	    var result;

	    if (!this._total) {
	        result  = this.get('quantity') * this.amount();
	        result -= this.discount();

	        this._total = parser.amount(result);
	    }

	    return currency(this._total, config);
	};


	/**
	 * Determine if this product has the same data as another.
	 *
	 * @param {object|Product} data Other product.
	 * @return {boolean}
	 */
	Product.prototype.isEqual = function isEqual(data) {
	    var match = false;

	    if (data instanceof Product) {
	        data = data._data;
	    }

	    if (this.get('w3ls_item') === data.w3ls_item) {
	        if (this.get('item_number') === data.item_number) {
	            if (this.get('amount') === parser.amount(data.amount)) {
	                var i = 0;

	                match = true;

	                while (typeof data['os' + i] !== 'undefined') {
	                    if (this.get('os' + i) !== data['os' + i]) {
	                        match = false;
	                        break;
	                    }

	                    i++;
	                }
	            }
	        }
	    }

	    return match;
	};


	/**
	 * Determine if this product is valid.
	 *
	 * @return {boolean}
	 */
	Product.prototype.isValid = function isValid() {
	    return (this.get('w3ls_item') && this.amount() > 0);
	};


	/**
	 * Destroys this product. Fires a "destroy" event.
	 */
	Product.prototype.destroy = function destroy() {
	    this._data = [];
	    this.fire('destroy', this);
	};




	module.exports = Product;

	},{"./util/currency":15,"./util/mixin":18,"./util/pubsub":19}],14:[function(require,module,exports){
	/* jshint quotmark:double */


	"use strict";



	module.exports.add = function add(el, str) {
	    var re;

	    if (!el) { return false; }

	    if (el && el.classList && el.classList.add) {
	        el.classList.add(str);
	    } else {
	        re = new RegExp("\\b" + str + "\\b");

	        if (!re.test(el.className)) {
	            el.className += " " + str;
	        }
	    }
	};


	module.exports.remove = function remove(el, str) {
	    var re;

	    if (!el) { return false; }

	    if (el.classList && el.classList.add) {
	        el.classList.remove(str);
	    } else {
	        re = new RegExp("\\b" + str + "\\b");

	        if (re.test(el.className)) {
	            el.className = el.className.replace(re, "");
	        }
	    }
	};


	module.exports.inject = function inject(el, str) {
	    var style;

	    if (!el) { return false; }

	    if (str) {
	        style = document.createElement("style");
	        style.type = "text/css";

	        if (style.styleSheet) {
	            style.styleSheet.cssText = str;
	        } else {
	            style.appendChild(document.createTextNode(str));
	        }

	        el.appendChild(style);
	    }
	};

	},{}],15:[function(require,module,exports){
	'use strict';


	var currencies = {
	    AED: { before: '\u062c' },
	    ANG: { before: '\u0192' },
	    ARS: { before: '$', code: true },
	    AUD: { before: '$', code: true },
	    AWG: { before: '\u0192' },
	    BBD: { before: '$', code: true },
	    BGN: { before: '\u043b\u0432' },
	    BMD: { before: '$', code: true },
	    BND: { before: '$', code: true },
	    BRL: { before: 'R$' },
	    BSD: { before: '$', code: true },
	    CAD: { before: '$', code: true },
	    CHF: { before: '', code: true },
	    CLP: { before: '$', code: true },
	    CNY: { before: '\u00A5' },
	    COP: { before: '$', code: true },
	    CRC: { before: '\u20A1' },
	    CZK: { before: 'Kc' },
	    DKK: { before: 'kr' },
	    DOP: { before: '$', code: true },
	    EEK: { before: 'kr' },
	    EUR: { before: '\u20AC' },
	    GBP: { before: '\u00A3' },
	    GTQ: { before: 'Q' },
	    HKD: { before: '$', code: true },
	    HRK: { before: 'kn' },
	    HUF: { before: 'Ft' },
	    IDR: { before: 'Rp' },
	    ILS: { before: '\u20AA' },
	    INR: { before: 'Rs.' },
	    ISK: { before: 'kr' },
	    JMD: { before: 'J$' },
	    JPY: { before: '\u00A5' },
	    KRW: { before: '\u20A9' },
	    KYD: { before: '$', code: true },
	    LTL: { before: 'Lt' },
	    LVL: { before: 'Ls' },
	    MXN: { before: '$', code: true },
	    MYR: { before: 'RM' },
	    NOK: { before: 'kr' },
	    NZD: { before: '$', code: true },
	    PEN: { before: 'S/' },
	    PHP: { before: 'Php' },
	    PLN: { before: 'z' },
	    QAR: { before: '\ufdfc' },
	    RON: { before: 'lei' },
	    RUB: { before: '\u0440\u0443\u0431' },
	    SAR: { before: '\ufdfc' },
	    SEK: { before: 'kr' },
	    SGD: { before: '$', code: true },
	    THB: { before: '\u0E3F' },
	    TRY: { before: 'TL' },
	    TTD: { before: 'TT$' },
	    TWD: { before: 'NT$' },
	    UAH: { before: '\u20b4' },
	    USD: { before: '$', code: true },
	    UYU: { before: '$U' },
	    VEF: { before: 'Bs' },
	    VND: { before: '\u20ab' },
	    XCD: { before: '$', code: true },
	    ZAR: { before: 'R' }
	};


	module.exports = function currency(amount, config) {
	    var code = config && config.currency || 'USD',
	        value = currencies[code],
	        before = value.before || '',
	        after = value.after || '',
	        length = value.length || 2,
	        showCode = value.code && config && config.showCode,
	        result = amount;

	    if (config && config.format) {
	        result = before + result.toFixed(length) + after;
	    }

	    if (showCode) {
	        result += ' ' + code;
	    }

	    return result;
	};

	},{}],16:[function(require,module,exports){
	'use strict';


	module.exports = (function (window, document) {

	    /**
	     * Events are added here for easy reference
	     */
	    var cache = [];

	    // NOOP for Node
	    if (!document) {
	        return {
	            add: function () {},
	            remove: function () {}
	        };
	    // Non-IE events
	    } else if (document.addEventListener) {
	        return {
	            /**
	             * Add an event to an object and optionally adjust it's scope
	             *
	             * @param obj {HTMLElement} The object to attach the event to
	             * @param type {string} The type of event excluding "on"
	             * @param fn {function} The function
	             * @param scope {object} Object to adjust the scope to (optional)
	             */
	            add: function (obj, type, fn, scope) {
	                scope = scope || obj;

	                var wrappedFn = function (e) { fn.call(scope, e); };

	                obj.addEventListener(type, wrappedFn, false);
	                cache.push([obj, type, fn, wrappedFn]);
	            },


	            /**
	             * Remove an event from an object
	             *
	             * @param obj {HTMLElement} The object to remove the event from
	             * @param type {string} The type of event excluding "on"
	             * @param fn {function} The function
	             */
	            remove: function (obj, type, fn) {
	                var wrappedFn, item, len = cache.length, i;

	                for (i = 0; i < len; i++) {
	                    item = cache[i];

	                    if (item[0] === obj && item[1] === type && item[2] === fn) {
	                        wrappedFn = item[3];

	                        if (wrappedFn) {
	                            obj.removeEventListener(type, wrappedFn, false);
	                            cache = cache.slice(i);
	                            return true;
	                        }
	                    }
	                }
	            }
	        };

	    // IE events
	    } else if (document.attachEvent) {
	        return {
	            /**
	             * Add an event to an object and optionally adjust it's scope (IE)
	             *
	             * @param obj {HTMLElement} The object to attach the event to
	             * @param type {string} The type of event excluding "on"
	             * @param fn {function} The function
	             * @param scope {object} Object to adjust the scope to (optional)
	             */
	            add: function (obj, type, fn, scope) {
	                scope = scope || obj;

	                var wrappedFn = function () {
	                    var e = window.event;
	                    e.target = e.target || e.srcElement;

	                    e.preventDefault = function () {
	                        e.returnValue = false;
	                    };

	                    fn.call(scope, e);
	                };

	                obj.attachEvent('on' + type, wrappedFn);
	                cache.push([obj, type, fn, wrappedFn]);
	            },


	            /**
	             * Remove an event from an object (IE)
	             *
	             * @param obj {HTMLElement} The object to remove the event from
	             * @param type {string} The type of event excluding "on"
	             * @param fn {function} The function
	             */
	            remove: function (obj, type, fn) {
	                var wrappedFn, item, len = cache.length, i;

	                for (i = 0; i < len; i++) {
	                    item = cache[i];

	                    if (item[0] === obj && item[1] === type && item[2] === fn) {
	                        wrappedFn = item[3];

	                        if (wrappedFn) {
	                            obj.detachEvent('on' + type, wrappedFn);
	                            cache = cache.slice(i);
	                            return true;
	                        }
	                    }
	                }
	            }
	        };
	    }

	})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);

	},{}],17:[function(require,module,exports){
	'use strict';


	var forms = module.exports = {

	    parse: function parse(form) {
	        var raw = form.elements,
	            data = {},
	            pair, value, i, len;

	        for (i = 0, len = raw.length; i < len; i++) {
	            pair = raw[i];

	            if ((value = forms.getInputValue(pair))) {
	                data[pair.name] = value;
	            }
	        }

	        return data;
	    },


	    getInputValue: function getInputValue(input) {
	        var tag = input.tagName.toLowerCase();

	        if (tag === 'select') {
	            return input.options[input.selectedIndex].value;
	        } else if (tag === 'textarea') {
	            return input.innerText;
	        } else {
	            if (input.type === 'radio') {
	                return (input.checked) ? input.value : null;
	            } else if (input.type === 'checkbox') {
	                return (input.checked) ? input.value : null;
	            } else {
	                return input.value;
	            }
	        }
	    }

	};
	},{}],18:[function(require,module,exports){
	'use strict';


	var mixin = module.exports = function mixin(dest, source) {
	    var value;

	    for (var key in source) {
	        value = source[key];

	        if (value && value.constructor === Object) {
	            if (!dest[key]) {
	                dest[key] = value;
	            } else {
	                mixin(dest[key] || {}, value);
	            }
	        } else {
	            dest[key] = value;
	        }
	    }

	    return dest;
	};

	},{}],19:[function(require,module,exports){
	'use strict';


	function Pubsub() {
	    this._eventCache = {};
	}


	Pubsub.prototype.on = function on(name, fn, scope) {
	    var cache = this._eventCache[name];

	    if (!cache) {
	        cache = this._eventCache[name] = [];
	    }

	    cache.push([fn, scope]);
	};


	Pubsub.prototype.off = function off(name, fn) {
	    var cache = this._eventCache[name],
	        i, len;

	    if (cache) {
	        for (i = 0, len = cache.length; i < len; i++) {
	            if (cache[i] === fn) {
	                cache = cache.splice(i, 1);
	            }
	        }
	    }
	};


	Pubsub.prototype.fire = function on(name) {
	    var cache = this._eventCache[name], i, len, fn, scope;

	    if (cache) {
	        for (i = 0, len = cache.length; i < len; i++) {
	            fn = cache[i][0];
	            scope = cache[i][1] || this;

	            if (typeof fn === 'function') {
	                fn.apply(scope, Array.prototype.slice.call(arguments, 1));
	            }
	        }
	    }
	};


	module.exports = Pubsub;

	},{}],20:[function(require,module,exports){
	'use strict';


	var Storage = module.exports = function Storage(name, duration) {
	    this._name = name;
	    this._duration = duration || 30;
	};


	var proto = Storage.prototype;


	proto.load = function () {
	    if (typeof window === 'object' && window.localStorage) {
	        var data = window.localStorage.getItem(this._name), today, expires;

	        if (data) {
	            data = JSON.parse(decodeURIComponent(data));
	        }

	        if (data && data.expires) {
	            today = new Date();
	            expires = new Date(data.expires);

	            if (today > expires) {
	                this.destroy();
	                return;
	            }
	        }

	        return data && data.value;
	    }
	};


	proto.save = function (data) {
	    if (typeof window === 'object' && window.localStorage) {
	        var expires = new Date(), wrapped;

	        expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

	        wrapped = {
	            value: data,
	            expires: expires.toGMTString()
	        };

	        window.localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrapped)));
	    }
	};


	proto.destroy = function () {
	    if (typeof window === 'object' && window.localStorage) {
	        window.localStorage.removeItem(this._name);
	    }
	};

	},{}],21:[function(require,module,exports){
	'use strict';


	var ejs = require('ejs');


	module.exports = function template(str, data) {
	    return ejs.render(str, data);
	};


	// Workaround for IE 8's lack of support
	if (!String.prototype.trim) {
	    String.prototype.trim = function () {
	        return this.replace(/^\s+|\s+$/g, '');
	    };
	}

	},{"ejs":6}],22:[function(require,module,exports){
	'use strict';


	var config = require('./config'),
	    events = require('./util/events'),
	    template = require('./util/template'),
	    forms = require('./util/forms'),
	    css = require('./util/css'),
	    viewevents = require('./viewevents'),
	    constants = require('./constants');



	/**
	 * Creates a view model.
	 *
	 * @constructor
	 * @param {object} model
	 */
	function View(model) {
	    var wrapper;

	    this.el = wrapper = document.createElement('div');
	    this.model = model;
	    this.isShowing = false;

	    // HTML
	    wrapper.id = config.name;
	    config.parent.appendChild(wrapper);

	    // CSS
	    css.inject(document.getElementsByTagName('head')[0], config.styles);

	    // JavaScript
	    events.add(document, ('ontouchstart' in window) ? 'touchstart' : 'click', viewevents.click, this);
	    events.add(document, 'keyup', viewevents.keyup, this);
	    events.add(document, 'readystatechange', viewevents.readystatechange, this);
	    events.add(window, 'pageshow', viewevents.pageshow, this);
	}


	/**
	 * Tells the view to redraw
	 */
	View.prototype.redraw = function redraw() {
	    events.remove(this.el.querySelector('form'), 'submit', this.model.cart.w3sb_checkout, this.model.cart);
	    this.el.innerHTML = template(config.template, this.model);
	    events.add(this.el.querySelector('form'), 'submit', this.model.cart.w3sb_checkout, this.model.cart);
	};


	/**
	 * Tells the view to show
	 */
	View.prototype.show = function show() {
	    if (!this.isShowing) {
	        css.add(document.body, constants.SHOWING_CLASS);
	        this.isShowing = true;
	    }
	};


	/**
	 * Tells the view to hide
	 */
	View.prototype.hide = function hide() {
	    if (this.isShowing) {
	        css.remove(document.body, constants.SHOWING_CLASS);
	        this.isShowing = false;
	    }
	};


	/**
	 * Toggles the visibility of the view
	 */
	View.prototype.toggle = function toggle() {
	    this[this.isShowing ? 'hide' : 'show']();
	};


	/**
	 * Binds cart submit events to a form.
	 *
	 * @param {HTMLElement} form
	 * @return {boolean}
	 */
	View.prototype.bind = function bind(form) {
	    var that = this;

	    // Don't bind forms without a cmd value
	    if (!constants.COMMANDS[form.cmd.value]) {
	        return false;
	    }

	    // Prevent re-binding forms
	    if (form.hassbmincart) {
	        return false;
	    } else {
	        form.hassbmincart = true;
	    }

	    if (form.display) {
	        events.add(form, 'submit', function (e) {
	            e.preventDefault();
	            that.show();
	        });
	    } else {
	        events.add(form, 'submit', function (e) {
	            e.preventDefault(e);
	            that.model.cart.add(forms.parse(form));
	        });
	    }

	    return true;
	};


	/**
	 * Adds an item to the view.
	 *
	 * @param {number} idx
	 * @param {object} data
	 */
	View.prototype.addItem = function addItem(idx, data) {
	    this.redraw();
	    this.show();

	    var els = this.el.querySelectorAll('.' + constants.ITEM_CLASS);
	    css.add(els[idx], constants.ITEM_CHANGED_CLASS);
	};


	/**
	 * Changes an item in the view.
	 *
	 * @param {number} idx
	 * @param {object} data
	 */
	View.prototype.changeItem = function changeItem(idx, data) {
	    this.redraw();
	    this.show();

	    var els = this.el.querySelectorAll('.' + constants.ITEM_CLASS);
	    css.add(els[idx], constants.ITEM_CHANGED_CLASS);
	};


	/**
	 * Removes an item from the view.
	 *
	 * @param {number} idx
	 */
	View.prototype.removeItem = function removeItem(idx) {
	    this.redraw();
	};




	module.exports = View;

	},{"./config":10,"./constants":11,"./util/css":14,"./util/events":16,"./util/forms":17,"./util/template":21,"./viewevents":23}],23:[function(require,module,exports){
	'use strict';


	var constants = require('./constants'),
	    events = require('./util/events'),
	    viewevents;


	module.exports = viewevents = {

	    click: function (evt) {
	        var target = evt.target,
	            className = target.className;

	        if (this.isShowing) {
	            // Cart close button
	            if (className === constants.CLOSER_CLASS) {
	                this.hide();
	            // Product remove button
	            } else if (className === constants.REMOVE_CLASS) {
	                this.model.cart.remove(target.getAttribute(constants.DATA_IDX));
	            // Product quantity input
	            } else if (className === constants.QUANTITY_CLASS) {
	                target[target.setSelectionRange ? 'setSelectionRange' : 'select'](0, 999);
	            // Outside the cart
	            } else if (!(/input|button|select|option/i.test(target.tagName))) {
	                while (target.nodeType === 1) {
	                    if (target === this.el) {
	                        return;
	                    }

	                    target = target.parentNode;
	                }

	                this.hide();
	            }
	        }
	    },


	    keyup: function (evt) {
	        var that = this,
	            target = evt.target,
	            timer;

	        if (target.className === constants.QUANTITY_CLASS) {
	            timer = setTimeout(function () {
	                var idx = parseInt(target.getAttribute(constants.DATA_IDX), 10),
	                    cart = that.model.cart,
	                    product = cart.items(idx),
	                    quantity = parseInt(target.value, 10);

	                if (product) {
	                    if (quantity > 0) {
	                        product.set('quantity', quantity);
	                    } else if (quantity === 0) {
	                        cart.remove(idx);
	                    }
	                }
	            }, constants.KEYUP_TIMEOUT);
	        }
	    },


	    readystatechange: function () {
	        if (/interactive|complete/.test(document.readyState)) {
	            var forms, form, i, len;

	            // Bind to page's forms
	            forms = document.getElementsByTagName('form');

	            for (i = 0, len = forms.length; i < len; i++) {
	                form = forms[i];

	                if (form.cmd && constants.COMMANDS[form.cmd.value]) {
	                    this.bind(form);
	                }
	            }

	            // Do the initial render when the buttons are ready
	            this.redraw();

	            // Only run this once
	            events.remove(document, 'readystatechange', viewevents.readystatechange);
	        }
	    },


	    pageshow: function (evt) {
	        if (evt.persisted) {
	            this.redraw();
	            this.hide();
	        }
	    }

	};

	},{"./constants":11,"./util/events":16}]},{},[9,10,11,12,13,14,15,16,17,18,19,20,21,22,23])

	/*!
	 * jQuery wmuSlider v2.1
	 * 
	 * Copyright (c) 2011 Brice Lechatellier
	 * http://brice.lechatellier.com/
	 *
	 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
	 */

	;(function($) {
	    
	    $.fn.wmuSlider = function(options) {

	        /* Default Options
	        ================================================== */       
	        var defaults = {
	            animation: 'fade',
	            animationDuration: 600,
	            slideshow: true,
	            slideshowSpeed: 7000,
	            slideToStart: 0,
	            navigationControl: true,
	            paginationControl: true,
	            previousText: 'Previous',
	            nextText: 'Next',
	            touch: false,
	            slide: 'article',
	            items: 1
	        };
	        var options = $.extend(defaults, options);
	        
	        return this.each(function() {

	            /* Variables
	            ================================================== */
	            var $this = $(this);
	            var currentIndex = options.slideToStart;
	            var wrapper = $this.find('.wmuSliderWrapper');
	            var slides = $this.find(options.slide);
	            var slidesCount = slides.length;
	            var slideshowTimeout;
	            var paginationControl;
	            var isAnimating;
	            
	            
	            /* Load Slide
	            ================================================== */ 
	            var loadSlide = function(index, infinite, touch) {
	                if (isAnimating) {
	                    return false;
	                }
	                isAnimating = true;
	                currentIndex = index;
	                var slide = $(slides[index]);
	                $this.animate({ height: slide.innerHeight() });
	                if (options.animation == 'fade') {
	                    slides.css({
	                        position: 'absolute',
	                        opacity: 0
	                    });
	                    slide.css('position', 'relative');
	                    slide.animate({ opacity:1 }, options.animationDuration, function() {
	                        isAnimating = false;
	                    });
	                } else if (options.animation == 'slide') {
	                    if (!infinite) {
	                        wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
	                            isAnimating = false;
	                        });
	                    } else {
	                        if (index == 0) {
	                            wrapper.animate({ marginLeft: -$this.width() / options.items * slidesCount }, options.animationDuration, function() {
	                                wrapper.css('marginLeft', 0);
	                                isAnimating = false;
	                            });
	                        } else {
	                            if (!touch) {
	                                wrapper.css('marginLeft', -$this.width() / options.items * slidesCount);
	                            }
	                            wrapper.animate({ marginLeft: -$this.width() / options.items * index }, options.animationDuration, function() {
	                                isAnimating = false;
	                            });
	                        }
	                    }
	                }

	                if (paginationControl) {
	                    paginationControl.find('a').each(function(i) {
	                        if(i == index) {
	                            $(this).addClass('wmuActive');
	                        } else {
	                            $(this).removeClass('wmuActive');
	                        }
	                    });
	                }    
	                                                    
	                // Trigger Event
	                $this.trigger('slideLoaded', index);             
	            };
	            
	        
	            /* Navigation Control
	            ================================================== */ 
	       /*--  if (options.navigationControl) {
	                var prev = $('<a class="wmuSliderPrev">' + options.previousText + '</a>');
	                prev.click(function(e) {
	                    e.preventDefault();
	                    clearTimeout(slideshowTimeout);
	                    if (currentIndex == 0) {
	                        loadSlide(slidesCount - 1, true);
	                    } else {
	                        loadSlide(currentIndex - 1);
	                    }
	                });
	                $this.append(prev);
	                
	                var next = $('<a class="wmuSliderNext">' + options.nextText + '</a>');
	                next.click(function(e) {
	                    e.preventDefault();
	                    clearTimeout(slideshowTimeout);
	                    if (currentIndex + 1 == slidesCount) {    
	                        loadSlide(0, true);
	                    } else {
	                        loadSlide(currentIndex + 1);
	                    }
	                });                
	                $this.append(next);
	            }
	         --*/

	            /* Pagination Control
	            ================================================== */ 
	            if (options.paginationControl) {
	                paginationControl = $('<ul class="wmuSliderPagination"></ul>');
	                $.each(slides, function(i) {
	                    paginationControl.append('<li><a href="#">' + i + '</a></li>');
	                    paginationControl.find('a:eq(' + i + ')').click(function(e) {    
	                        e.preventDefault();
	                        clearTimeout(slideshowTimeout);   
	                        loadSlide(i);
	                    });                
	                });
	                $this.append(paginationControl);
	            }
	            
	            
	            /* Slideshow
	            ================================================== */ 
	            if (options.slideshow) {
	                var slideshow = function() {
	                    if (currentIndex + 1 < slidesCount) {
	                        loadSlide(currentIndex + 1);
	                    } else {
	                        loadSlide(0, true);
	                    }
	                    slideshowTimeout = setTimeout(slideshow, options.slideshowSpeed);
	                }
	                slideshowTimeout = setTimeout(slideshow, options.slideshowSpeed);
	            }
	            
	                        
	            /* Resize Slider
	            ================================================== */ 
	            var resize = function() {
	                var slide = $(slides[currentIndex]);
	                $this.animate({ height: slide.innerHeight() });
	                if (options.animation == 'slide') {
	                    slides.css({
	                        width: $this.width() / options.items
	                    });
	                    wrapper.css({
	                        marginLeft: -$this.width() / options.items * currentIndex,
	                        width: $this.width() * slides.length
	                    });                    
	                }    
	            };
	            
	                        
	            /* Touch
	            ================================================== */
	            var touchSwipe = function(event, phase, direction, distance) {
	                clearTimeout(slideshowTimeout);              
	                if(phase == 'move' && (direction == 'left' || direction == 'right')) {
	                    if (direction == 'right') {
	                        if (currentIndex == 0) {
	                            wrapper.css('marginLeft', (-slidesCount * $this.width() / options.items) + distance);
	                        } else {
	                            wrapper.css('marginLeft', (-currentIndex * $this.width() / options.items) + distance);
	                        }
	                    } else if (direction == 'left') {
	                        wrapper.css('marginLeft', (-currentIndex * $this.width() / options.items) - distance);
	                    }
	                } else if (phase == 'cancel' ) {
	                    if (direction == 'right' && currentIndex == 0) {
	                        wrapper.animate({ marginLeft: -slidesCount * $this.width() / options.items }, options.animationDuration);                
	                    } else {
	                        wrapper.animate({ marginLeft: -currentIndex * $this.width() / options.items }, options.animationDuration);  
	                    }
	                } else if (phase == 'end' ) {
	                    if (direction == 'right') {
	                        if (currentIndex == 0) {
	                            loadSlide(slidesCount - 1, true, true);
	                        } else {
	                            loadSlide(currentIndex - 1);
	                        }
	                    } else if (direction == 'left')    {        
	                        if (currentIndex + 1 == slidesCount) {
	                            loadSlide(0, true);
	                        } else {
	                            loadSlide(currentIndex + 1);
	                        }
	                    } else {
	                        wrapper.animate({ marginLeft: -currentIndex * $this.width() / options.items }, options.animationDuration);
	                    }
	                }            
	            };
	            if (options.touch && options.animation == 'slide') {
	                if (!$.isFunction($.fn.swipe)) {
	                    $.ajax({
	                        url: 'jquery.touchSwipe.min.js',
	                        async: false
	                    });
	                }
	                if ($.isFunction($.fn.swipe)) {
	                    $this.swipe({ triggerOnTouchEnd:false, swipeStatus:touchSwipe, allowPageScroll:'vertical' });
	                }
	            }
	            
	            
	            /* Init Slider
	            ================================================== */ 
	            var init = function() {
	                var slide = $(slides[currentIndex]);
	                var img = slide.find('img');
	                img.load(function() {
	                    wrapper.show();
	                    $this.animate({ height: slide.innerHeight() });
	                });
	                if (options.animation == 'fade') {
	                    slides.css({
	                        position: 'absolute',
	                        width: '100%',
	                        opacity: 0
	                    });
	                    $(slides[currentIndex]).css('position', 'relative');
	                } else if (options.animation == 'slide') {
	                    if (options.items > slidesCount) {
	                        options.items = slidesCount;
	                    }
	                    slides.css('float', 'left');                    
	                    slides.each(function(i){
	                        var slide = $(this);
	                        slide.attr('data-index', i);
	                    });
	                    for(var i = 0; i < options.items; i++) {
	                        wrapper.append($(slides[i]).clone());
	                    }
	                    slides = $this.find(options.slide);
	                }
	                resize();
	                
	                $this.trigger('hasLoaded');
	                
	                loadSlide(currentIndex);
	            }
	            init();
	            
	                                                
	            /* Bind Events
	            ================================================== */
	            // Resize
	            $(window).resize(resize);
	            
	            // Load Slide
	            $this.bind('loadSlide', function(e, i) {
	                clearTimeout(slideshowTimeout);
	                loadSlide(i);
	            });
	                        
	        });
	    }
	    
	})(jQuery);

	/*! Magnific Popup - v0.9.9 - 2013-11-15
	* http://dimsemenov.com/plugins/magnific-popup/
	* Copyright (c) 2013 Dmitry Semenov; */
	;(function($) {

	/*>>core*/
	/**
	 * 
	 * Magnific Popup Core JS file
	 * 
	 */


	/**
	 * Private static constants
	 */
	var CLOSE_EVENT = 'Close',
		BEFORE_CLOSE_EVENT = 'BeforeClose',
		AFTER_CLOSE_EVENT = 'AfterClose',
		BEFORE_APPEND_EVENT = 'BeforeAppend',
		MARKUP_PARSE_EVENT = 'MarkupParse',
		OPEN_EVENT = 'Open',
		CHANGE_EVENT = 'Change',
		NS = 'mfp',
		EVENT_NS = '.' + NS,
		READY_CLASS = 'mfp-ready',
		REMOVING_CLASS = 'mfp-removing',
		PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


	/**
	 * Private vars 
	 */
	var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
		MagnificPopup = function(){},
		_isJQ = !!(window.jQuery),
		_prevStatus,
		_window = $(window),
		_body,
		_document,
		_prevContentType,
		_wrapClasses,
		_currPopupType;


	/**
	 * Private functions
	 */
	var _mfpOn = function(name, f) {
			mfp.ev.on(NS + name + EVENT_NS, f);
		},
		_getEl = function(className, appendTo, html, raw) {
			var el = document.createElement('div');
			el.className = 'mfp-'+className;
			if(html) {
				el.innerHTML = html;
			}
			if(!raw) {
				el = $(el);
				if(appendTo) {
					el.appendTo(appendTo);
				}
			} else if(appendTo) {
				appendTo.appendChild(el);
			}
			return el;
		},
		_mfpTrigger = function(e, data) {
			mfp.ev.triggerHandler(NS + e, data);

			if(mfp.st.callbacks) {
				// converts "mfpEventName" to "eventName" callback and triggers it if it's present
				e = e.charAt(0).toLowerCase() + e.slice(1);
				if(mfp.st.callbacks[e]) {
					mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
				}
			}
		},
		_getCloseBtn = function(type) {
			if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
				mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
				_currPopupType = type;
			}
			return mfp.currTemplate.closeBtn;
		},
		// Initialize Magnific Popup only when called at least once
		_checkInstance = function() {
			if(!$.magnificPopup.instance) {
				mfp = new MagnificPopup();
				mfp.init();
				$.magnificPopup.instance = mfp;
			}
		},
		// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
		supportsTransitions = function() {
			var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
				v = ['ms','O','Moz','Webkit']; // 'v' for vendor

			if( s['transition'] !== undefined ) {
				return true; 
			}
				
			while( v.length ) {
				if( v.pop() + 'Transition' in s ) {
					return true;
				}
			}
					
			return false;
		};



	/**
	 * Public functions
	 */
	MagnificPopup.prototype = {

		constructor: MagnificPopup,

		/**
		 * Initializes Magnific Popup plugin. 
		 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
		 */
		init: function() {
			var appVersion = navigator.appVersion;
			mfp.isIE7 = appVersion.indexOf("MSIE 7.") !== -1; 
			mfp.isIE8 = appVersion.indexOf("MSIE 8.") !== -1;
			mfp.isLowIE = mfp.isIE7 || mfp.isIE8;
			mfp.isAndroid = (/android/gi).test(appVersion);
			mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
			mfp.supportsTransition = supportsTransitions();

			// We disable fixed positioned lightbox on devices that don't handle it nicely.
			// If you know a better way of detecting this - let me know.
			mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
			_body = $(document.body);
			_document = $(document);

			mfp.popupsCache = {};
		},

		/**
		 * Opens popup
		 * @param  data [description]
		 */
		open: function(data) {

			var i;

			if(data.isObj === false) { 
				// convert jQuery collection to array to avoid conflicts later
				mfp.items = data.items.toArray();

				mfp.index = 0;
				var items = data.items,
					item;
				for(i = 0; i < items.length; i++) {
					item = items[i];
					if(item.parsed) {
						item = item.el[0];
					}
					if(item === data.el[0]) {
						mfp.index = i;
						break;
					}
				}
			} else {
				mfp.items = $.isArray(data.items) ? data.items : [data.items];
				mfp.index = data.index || 0;
			}

			// if popup is already opened - we just update the content
			if(mfp.isOpen) {
				mfp.updateItemHTML();
				return;
			}
			
			mfp.types = []; 
			_wrapClasses = '';
			if(data.mainEl && data.mainEl.length) {
				mfp.ev = data.mainEl.eq(0);
			} else {
				mfp.ev = _document;
			}

			if(data.key) {
				if(!mfp.popupsCache[data.key]) {
					mfp.popupsCache[data.key] = {};
				}
				mfp.currTemplate = mfp.popupsCache[data.key];
			} else {
				mfp.currTemplate = {};
			}



			mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
			mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

			if(mfp.st.modal) {
				mfp.st.closeOnContentClick = false;
				mfp.st.closeOnBgClick = false;
				mfp.st.showCloseBtn = false;
				mfp.st.enableEscapeKey = false;
			}
			

			// Building markup
			// main containers are created only once
			if(!mfp.bgOverlay) {

				// Dark overlay
				mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
					mfp.close();
				});

				mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
					if(mfp._checkIfClose(e.target)) {
						mfp.close();
					}
				});

				mfp.container = _getEl('container', mfp.wrap);
			}

			mfp.contentContainer = _getEl('content');
			if(mfp.st.preloader) {
				mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
			}


			// Initializing modules
			var modules = $.magnificPopup.modules;
			for(i = 0; i < modules.length; i++) {
				var n = modules[i];
				n = n.charAt(0).toUpperCase() + n.slice(1);
				mfp['init'+n].call(mfp);
			}
			_mfpTrigger('BeforeOpen');


			if(mfp.st.showCloseBtn) {
				// Close button
				if(!mfp.st.closeBtnInside) {
					mfp.wrap.append( _getCloseBtn() );
				} else {
					_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
						values.close_replaceWith = _getCloseBtn(item.type);
					});
					_wrapClasses += ' mfp-close-btn-in';
				}
			}

			if(mfp.st.alignTop) {
				_wrapClasses += ' mfp-align-top';
			}

		

			if(mfp.fixedContentPos) {
				mfp.wrap.css({
					overflow: mfp.st.overflowY,
					overflowX: 'hidden',
					overflowY: mfp.st.overflowY
				});
			} else {
				mfp.wrap.css({ 
					top: _window.scrollTop(),
					position: 'absolute'
				});
			}
			if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
				mfp.bgOverlay.css({
					height: _document.height(),
					position: 'absolute'
				});
			}

			

			if(mfp.st.enableEscapeKey) {
				// Close on ESC key
				_document.on('keyup' + EVENT_NS, function(e) {
					if(e.keyCode === 27) {
						mfp.close();
					}
				});
			}

			_window.on('resize' + EVENT_NS, function() {
				mfp.updateSize();
			});


			if(!mfp.st.closeOnContentClick) {
				_wrapClasses += ' mfp-auto-cursor';
			}
			
			if(_wrapClasses)
				mfp.wrap.addClass(_wrapClasses);


			// this triggers recalculation of layout, so we get it once to not to trigger twice
			var windowHeight = mfp.wH = _window.height();

			
			var windowStyles = {};

			if( mfp.fixedContentPos ) {
	            if(mfp._hasScrollBar(windowHeight)){
	                var s = mfp._getScrollbarSize();
	                if(s) {
	                    windowStyles.marginRight = s;
	                }
	            }
	        }

			if(mfp.fixedContentPos) {
				if(!mfp.isIE7) {
					windowStyles.overflow = 'hidden';
				} else {
					// ie7 double-scroll bug
					$('body, html').css('overflow', 'hidden');
				}
			}

			
			
			var classesToadd = mfp.st.mainClass;
			if(mfp.isIE7) {
				classesToadd += ' mfp-ie7';
			}
			if(classesToadd) {
				mfp._addClassToMFP( classesToadd );
			}

			// add content
			mfp.updateItemHTML();

			_mfpTrigger('BuildControls');


			// remove scrollbar, add margin e.t.c
			$('html').css(windowStyles);
			
			// add everything to DOM
			mfp.bgOverlay.add(mfp.wrap).prependTo( document.body );



			// Save last focused element
			mfp._lastFocusedEl = document.activeElement;
			
			// Wait for next cycle to allow CSS transition
			setTimeout(function() {
				
				if(mfp.content) {
					mfp._addClassToMFP(READY_CLASS);
					mfp._setFocus();
				} else {
					// if content is not defined (not loaded e.t.c) we add class only for BG
					mfp.bgOverlay.addClass(READY_CLASS);
				}
				
				// Trap the focus in popup
				_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

			}, 16);

			mfp.isOpen = true;
			mfp.updateSize(windowHeight);
			_mfpTrigger(OPEN_EVENT);

			return data;
		},

		/**
		 * Closes the popup
		 */
		close: function() {
			if(!mfp.isOpen) return;
			_mfpTrigger(BEFORE_CLOSE_EVENT);

			mfp.isOpen = false;
			// for CSS3 animation
			if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
				mfp._addClassToMFP(REMOVING_CLASS);
				setTimeout(function() {
					mfp._close();
				}, mfp.st.removalDelay);
			} else {
				mfp._close();
			}
		},

		/**
		 * Helper for close() function
		 */
		_close: function() {
			_mfpTrigger(CLOSE_EVENT);

			var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

			mfp.bgOverlay.detach();
			mfp.wrap.detach();
			mfp.container.empty();

			if(mfp.st.mainClass) {
				classesToRemove += mfp.st.mainClass + ' ';
			}

			mfp._removeClassFromMFP(classesToRemove);

			if(mfp.fixedContentPos) {
				var windowStyles = {marginRight: ''};
				if(mfp.isIE7) {
					$('body, html').css('overflow', '');
				} else {
					windowStyles.overflow = '';
				}
				$('html').css(windowStyles);
			}
			
			_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
			mfp.ev.off(EVENT_NS);

			// clean up DOM elements that aren't removed
			mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
			mfp.bgOverlay.attr('class', 'mfp-bg');
			mfp.container.attr('class', 'mfp-container');

			// remove close button from target element
			if(mfp.st.showCloseBtn &&
			(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
				if(mfp.currTemplate.closeBtn)
					mfp.currTemplate.closeBtn.detach();
			}


			if(mfp._lastFocusedEl) {
				$(mfp._lastFocusedEl).focus(); // put tab focus back
			}
			mfp.currItem = null;	
			mfp.content = null;
			mfp.currTemplate = null;
			mfp.prevHeight = 0;

			_mfpTrigger(AFTER_CLOSE_EVENT);
		},
		
		updateSize: function(winHeight) {

			if(mfp.isIOS) {
				// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
				var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
				var height = window.innerHeight * zoomLevel;
				mfp.wrap.css('height', height);
				mfp.wH = height;
			} else {
				mfp.wH = winHeight || _window.height();
			}
			// Fixes #84: popup incorrectly positioned with position:relative on body
			if(!mfp.fixedContentPos) {
				mfp.wrap.css('height', mfp.wH);
			}

			_mfpTrigger('Resize');

		},

		/**
		 * Set content of popup based on current index
		 */
		updateItemHTML: function() {
			var item = mfp.items[mfp.index];

			// Detach and perform modifications
			mfp.contentContainer.detach();

			if(mfp.content)
				mfp.content.detach();

			if(!item.parsed) {
				item = mfp.parseEl( mfp.index );
			}

			var type = item.type;	

			_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
			// BeforeChange event works like so:
			// _mfpOn('BeforeChange', function(e, prevType, newType) { });
			
			mfp.currItem = item;

			

			

			if(!mfp.currTemplate[type]) {
				var markup = mfp.st[type] ? mfp.st[type].markup : false;

				// allows to modify markup
				_mfpTrigger('FirstMarkupParse', markup);

				if(markup) {
					mfp.currTemplate[type] = $(markup);
				} else {
					// if there is no markup found we just define that template is parsed
					mfp.currTemplate[type] = true;
				}
			}

			if(_prevContentType && _prevContentType !== item.type) {
				mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
			}
			
			var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
			mfp.appendContent(newContent, type);

			item.preloaded = true;

			_mfpTrigger(CHANGE_EVENT, item);
			_prevContentType = item.type;
			
			// Append container back after its content changed
			mfp.container.prepend(mfp.contentContainer);

			_mfpTrigger('AfterChange');
		},


		/**
		 * Set HTML content of popup
		 */
		appendContent: function(newContent, type) {
			mfp.content = newContent;
			
			if(newContent) {
				if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
					mfp.currTemplate[type] === true) {
					// if there is no markup, we just append close button element inside
					if(!mfp.content.find('.mfp-close').length) {
						mfp.content.append(_getCloseBtn());
					}
				} else {
					mfp.content = newContent;
				}
			} else {
				mfp.content = '';
			}

			_mfpTrigger(BEFORE_APPEND_EVENT);
			mfp.container.addClass('mfp-'+type+'-holder');

			mfp.contentContainer.append(mfp.content);
		},



		
		/**
		 * Creates Magnific Popup data object based on given data
		 * @param  {int} index Index of item to parse
		 */
		parseEl: function(index) {
			var item = mfp.items[index],
				type = item.type;

			if(item.tagName) {
				item = { el: $(item) };
			} else {
				item = { data: item, src: item.src };
			}

			if(item.el) {
				var types = mfp.types;

				// check for 'mfp-TYPE' class
				for(var i = 0; i < types.length; i++) {
					if( item.el.hasClass('mfp-'+types[i]) ) {
						type = types[i];
						break;
					}
				}

				item.src = item.el.attr('data-mfp-src');
				if(!item.src) {
					item.src = item.el.attr('href');
				}
			}

			item.type = type || mfp.st.type || 'inline';
			item.index = index;
			item.parsed = true;
			mfp.items[index] = item;
			_mfpTrigger('ElementParse', item);

			return mfp.items[index];
		},


		/**
		 * Initializes single popup or a group of popups
		 */
		addGroup: function(el, options) {
			var eHandler = function(e) {
				e.mfpEl = this;
				mfp._openClick(e, el, options);
			};

			if(!options) {
				options = {};
			} 

			var eName = 'click.magnificPopup';
			options.mainEl = el;
			
			if(options.items) {
				options.isObj = true;
				el.off(eName).on(eName, eHandler);
			} else {
				options.isObj = false;
				if(options.delegate) {
					el.off(eName).on(eName, options.delegate , eHandler);
				} else {
					options.items = el;
					el.off(eName).on(eName, eHandler);
				}
			}
		},
		_openClick: function(e, el, options) {
			var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


			if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey ) ) {
				return;
			}

			var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

			if(disableOn) {
				if($.isFunction(disableOn)) {
					if( !disableOn.call(mfp) ) {
						return true;
					}
				} else { // else it's number
					if( _window.width() < disableOn ) {
						return true;
					}
				}
			}
			
			if(e.type) {
				e.preventDefault();

				// This will prevent popup from closing if element is inside and popup is already opened
				if(mfp.isOpen) {
					e.stopPropagation();
				}
			}
				

			options.el = $(e.mfpEl);
			if(options.delegate) {
				options.items = el.find(options.delegate);
			}
			mfp.open(options);
		},


		/**
		 * Updates text on preloader
		 */
		updateStatus: function(status, text) {

			if(mfp.preloader) {
				if(_prevStatus !== status) {
					mfp.container.removeClass('mfp-s-'+_prevStatus);
				}

				if(!text && status === 'loading') {
					text = mfp.st.tLoading;
				}

				var data = {
					status: status,
					text: text
				};
				// allows to modify status
				_mfpTrigger('UpdateStatus', data);

				status = data.status;
				text = data.text;

				mfp.preloader.html(text);

				mfp.preloader.find('a').on('click', function(e) {
					e.stopImmediatePropagation();
				});

				mfp.container.addClass('mfp-s-'+status);
				_prevStatus = status;
			}
		},


		/*
			"Private" helpers that aren't private at all
		 */
		// Check to close popup or not
		// "target" is an element that was clicked
		_checkIfClose: function(target) {

			if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
				return;
			}

			var closeOnContent = mfp.st.closeOnContentClick;
			var closeOnBg = mfp.st.closeOnBgClick;

			if(closeOnContent && closeOnBg) {
				return true;
			} else {

				// We close the popup if click is on close button or on preloader. Or if there is no content.
				if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
					return true;
				}

				// if click is outside the content
				if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
					if(closeOnBg) {
						// last check, if the clicked element is in DOM, (in case it's removed onclick)
						if( $.contains(document, target) ) {
							return true;
						}
					}
				} else if(closeOnContent) {
					return true;
				}

			}
			return false;
		},
		_addClassToMFP: function(cName) {
			mfp.bgOverlay.addClass(cName);
			mfp.wrap.addClass(cName);
		},
		_removeClassFromMFP: function(cName) {
			this.bgOverlay.removeClass(cName);
			mfp.wrap.removeClass(cName);
		},
		_hasScrollBar: function(winHeight) {
			return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
		},
		_setFocus: function() {
			(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
		},
		_onFocusIn: function(e) {
			if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
				mfp._setFocus();
				return false;
			}
		},
		_parseMarkup: function(template, values, item) {
			var arr;
			if(item.data) {
				values = $.extend(item.data, values);
			}
			_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

			$.each(values, function(key, value) {
				if(value === undefined || value === false) {
					return true;
				}
				arr = key.split('_');
				if(arr.length > 1) {
					var el = template.find(EVENT_NS + '-'+arr[0]);

					if(el.length > 0) {
						var attr = arr[1];
						if(attr === 'replaceWith') {
							if(el[0] !== value[0]) {
								el.replaceWith(value);
							}
						} else if(attr === 'img') {
							if(el.is('img')) {
								el.attr('src', value);
							} else {
								el.replaceWith( '<img src="'+value+'" class="' + el.attr('class') + '" />' );
							}
						} else {
							el.attr(arr[1], value);
						}
					}

				} else {
					template.find(EVENT_NS + '-'+key).html(value);
				}
			});
		},

		_getScrollbarSize: function() {
			// thx David
			if(mfp.scrollbarSize === undefined) {
				var scrollDiv = document.createElement("div");
				scrollDiv.id = "mfp-sbm";
				scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
				document.body.appendChild(scrollDiv);
				mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
				document.body.removeChild(scrollDiv);
			}
			return mfp.scrollbarSize;
		}

	}; /* MagnificPopup core prototype end */




	/**
	 * Public static functions
	 */
	$.magnificPopup = {
		instance: null,
		proto: MagnificPopup.prototype,
		modules: [],

		open: function(options, index) {
			_checkInstance();	

			if(!options) {
				options = {};
			} else {
				options = $.extend(true, {}, options);
			}
				

			options.isObj = true;
			options.index = index || 0;
			return this.instance.open(options);
		},

		close: function() {
			return $.magnificPopup.instance && $.magnificPopup.instance.close();
		},

		registerModule: function(name, module) {
			if(module.options) {
				$.magnificPopup.defaults[name] = module.options;
			}
			$.extend(this.proto, module.proto);			
			this.modules.push(name);
		},

		defaults: {   

			// Info about options is in docs:
			// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options
			
			disableOn: 0,	

			key: null,

			midClick: false,

			mainClass: '',

			preloader: true,

			focus: '', // CSS selector of input to focus after popup is opened
			
			closeOnContentClick: false,

			closeOnBgClick: true,

			closeBtnInside: true, 

			showCloseBtn: true,

			enableEscapeKey: true,

			modal: false,

			alignTop: false,
		
			removalDelay: 0,
			
			fixedContentPos: 'auto', 
		
			fixedBgPos: 'auto',

			overflowY: 'auto',

			closeMarkup: '<button title="%title%" type="button" class="mfp-close">&times;</button>',

			tClose: 'Close (Esc)',

			tLoading: 'Loading...'

		}
	};



	$.fn.magnificPopup = function(options) {
		_checkInstance();

		var jqEl = $(this);

		// We call some API method of first param is a string
		if (typeof options === "string" ) {

			if(options === 'open') {
				var items,
					itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
					index = parseInt(arguments[1], 10) || 0;

				if(itemOpts.items) {
					items = itemOpts.items[index];
				} else {
					items = jqEl;
					if(itemOpts.delegate) {
						items = items.find(itemOpts.delegate);
					}
					items = items.eq( index );
				}
				mfp._openClick({mfpEl:items}, jqEl, itemOpts);
			} else {
				if(mfp.isOpen)
					mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
			}

		} else {
			// clone options obj
			options = $.extend(true, {}, options);
			
			/*
			 * As Zepto doesn't support .data() method for objects 
			 * and it works only in normal browsers
			 * we assign "options" object directly to the DOM element. FTW!
			 */
			if(_isJQ) {
				jqEl.data('magnificPopup', options);
			} else {
				jqEl[0].magnificPopup = options;
			}

			mfp.addGroup(jqEl, options);

		}
		return jqEl;
	};


	//Quick benchmark
	/*
	var start = performance.now(),
		i,
		rounds = 1000;

	for(i = 0; i < rounds; i++) {

	}
	console.log('Test #1:', performance.now() - start);

	start = performance.now();
	for(i = 0; i < rounds; i++) {

	}
	console.log('Test #2:', performance.now() - start);
	*/


	/*>>core*/

	/*>>inline*/

	var INLINE_NS = 'inline',
		_hiddenClass,
		_inlinePlaceholder, 
		_lastInlineElement,
		_putInlineElementsBack = function() {
			if(_lastInlineElement) {
				_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
				_lastInlineElement = null;
			}
		};

	$.magnificPopup.registerModule(INLINE_NS, {
		options: {
			hiddenClass: 'hide', // will be appended with `mfp-` prefix
			markup: '',
			tNotFound: 'Content not found'
		},
		proto: {

			initInline: function() {
				mfp.types.push(INLINE_NS);

				_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
					_putInlineElementsBack();
				});
			},

			getInline: function(item, template) {

				_putInlineElementsBack();

				if(item.src) {
					var inlineSt = mfp.st.inline,
						el = $(item.src);

					if(el.length) {

						// If target element has parent - we replace it with placeholder and put it back after popup is closed
						var parent = el[0].parentNode;
						if(parent && parent.tagName) {
							if(!_inlinePlaceholder) {
								_hiddenClass = inlineSt.hiddenClass;
								_inlinePlaceholder = _getEl(_hiddenClass);
								_hiddenClass = 'mfp-'+_hiddenClass;
							}
							// replace target inline element with placeholder
							_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
						}

						mfp.updateStatus('ready');
					} else {
						mfp.updateStatus('error', inlineSt.tNotFound);
						el = $('<div>');
					}

					item.inlineElement = el;
					return el;
				}

				mfp.updateStatus('ready');
				mfp._parseMarkup(template, {}, item);
				return template;
			}
		}
	});

	/*>>inline*/

	/*>>ajax*/
	var AJAX_NS = 'ajax',
		_ajaxCur,
		_removeAjaxCursor = function() {
			if(_ajaxCur) {
				_body.removeClass(_ajaxCur);
			}
		},
		_destroyAjaxRequest = function() {
			_removeAjaxCursor();
			if(mfp.req) {
				mfp.req.abort();
			}
		};

	$.magnificPopup.registerModule(AJAX_NS, {

		options: {
			settings: null,
			cursor: 'mfp-ajax-cur',
			tError: '<a href="%url%">The content</a> could not be loaded.'
		},

		proto: {
			initAjax: function() {
				mfp.types.push(AJAX_NS);
				_ajaxCur = mfp.st.ajax.cursor;

				_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
				_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
			},
			getAjax: function(item) {

				if(_ajaxCur)
					_body.addClass(_ajaxCur);

				mfp.updateStatus('loading');

				var opts = $.extend({
					url: item.src,
					success: function(data, textStatus, jqXHR) {
						var temp = {
							data:data,
							xhr:jqXHR
						};

						_mfpTrigger('ParseAjax', temp);

						mfp.appendContent( $(temp.data), AJAX_NS );

						item.finished = true;

						_removeAjaxCursor();

						mfp._setFocus();

						setTimeout(function() {
							mfp.wrap.addClass(READY_CLASS);
						}, 16);

						mfp.updateStatus('ready');

						_mfpTrigger('AjaxContentAdded');
					},
					error: function() {
						_removeAjaxCursor();
						item.finished = item.loadError = true;
						mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
					}
				}, mfp.st.ajax.settings);

				mfp.req = $.ajax(opts);

				return '';
			}
		}
	});





		

	/*>>ajax*/

	/*>>image*/
	var _imgInterval,
		_getTitle = function(item) {
			if(item.data && item.data.title !== undefined) 
				return item.data.title;

			var src = mfp.st.image.titleSrc;

			if(src) {
				if($.isFunction(src)) {
					return src.call(mfp, item);
				} else if(item.el) {
					return item.el.attr(src) || '';
				}
			}
			return '';
		};

	$.magnificPopup.registerModule('image', {

		options: {
			markup: '<div class="mfp-figure">'+
						'<div class="mfp-close"></div>'+
						'<figure>'+
							'<div class="mfp-img"></div>'+
							'<figcaption>'+
								'<div class="mfp-bottom-bar">'+
									'<div class="mfp-title"></div>'+
									'<div class="mfp-counter"></div>'+
								'</div>'+
							'</figcaption>'+
						'</figure>'+
					'</div>',
			cursor: 'mfp-zoom-out-cur',
			titleSrc: 'title', 
			verticalFit: true,
			tError: '<a href="%url%">The image</a> could not be loaded.'
		},

		proto: {
			initImage: function() {
				var imgSt = mfp.st.image,
					ns = '.image';

				mfp.types.push('image');

				_mfpOn(OPEN_EVENT+ns, function() {
					if(mfp.currItem.type === 'image' && imgSt.cursor) {
						_body.addClass(imgSt.cursor);
					}
				});

				_mfpOn(CLOSE_EVENT+ns, function() {
					if(imgSt.cursor) {
						_body.removeClass(imgSt.cursor);
					}
					_window.off('resize' + EVENT_NS);
				});

				_mfpOn('Resize'+ns, mfp.resizeImage);
				if(mfp.isLowIE) {
					_mfpOn('AfterChange', mfp.resizeImage);
				}
			},
			resizeImage: function() {
				var item = mfp.currItem;
				if(!item || !item.img) return;

				if(mfp.st.image.verticalFit) {
					var decr = 0;
					// fix box-sizing in ie7/8
					if(mfp.isLowIE) {
						decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
					}
					item.img.css('max-height', mfp.wH-decr);
				}
			},
			_onImageHasSize: function(item) {
				if(item.img) {
					
					item.hasSize = true;

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					
					item.isCheckingImgSize = false;

					_mfpTrigger('ImageHasSize', item);

					if(item.imgHidden) {
						if(mfp.content)
							mfp.content.removeClass('mfp-loading');
						
						item.imgHidden = false;
					}

				}
			},

			/**
			 * Function that loops until the image has size to display elements that rely on it asap
			 */
			findImageSize: function(item) {

				var counter = 0,
					img = item.img[0],
					mfpSetInterval = function(delay) {

						if(_imgInterval) {
							clearInterval(_imgInterval);
						}
						// decelerating interval that checks for size of an image
						_imgInterval = setInterval(function() {
							if(img.naturalWidth > 0) {
								mfp._onImageHasSize(item);
								return;
							}

							if(counter > 200) {
								clearInterval(_imgInterval);
							}

							counter++;
							if(counter === 3) {
								mfpSetInterval(10);
							} else if(counter === 40) {
								mfpSetInterval(50);
							} else if(counter === 100) {
								mfpSetInterval(500);
							}
						}, delay);
					};

				mfpSetInterval(1);
			},

			getImage: function(item, template) {

				var guard = 0,

					// image load complete handler
					onLoadComplete = function() {
						if(item) {
							if (item.img[0].complete) {
								item.img.off('.mfploader');
								
								if(item === mfp.currItem){
									mfp._onImageHasSize(item);

									mfp.updateStatus('ready');
								}

								item.hasSize = true;
								item.loaded = true;

								_mfpTrigger('ImageLoadComplete');
								
							}
							else {
								// if image complete check fails 200 times (20 sec), we assume that there was an error.
								guard++;
								if(guard < 200) {
									setTimeout(onLoadComplete,100);
								} else {
									onLoadError();
								}
							}
						}
					},

					// image error handler
					onLoadError = function() {
						if(item) {
							item.img.off('.mfploader');
							if(item === mfp.currItem){
								mfp._onImageHasSize(item);
								mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
							}

							item.hasSize = true;
							item.loaded = true;
							item.loadError = true;
						}
					},
					imgSt = mfp.st.image;


				var el = template.find('.mfp-img');
				if(el.length) {
					var img = document.createElement('img');
					img.className = 'mfp-img';
					item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
					img.src = item.src;

					// without clone() "error" event is not firing when IMG is replaced by new IMG
					// TODO: find a way to avoid such cloning
					if(el.is('img')) {
						item.img = item.img.clone();
					}
					if(item.img[0].naturalWidth > 0) {
						item.hasSize = true;
					}
				}

				mfp._parseMarkup(template, {
					title: _getTitle(item),
					img_replaceWith: item.img
				}, item);

				mfp.resizeImage();

				if(item.hasSize) {
					if(_imgInterval) clearInterval(_imgInterval);

					if(item.loadError) {
						template.addClass('mfp-loading');
						mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
					} else {
						template.removeClass('mfp-loading');
						mfp.updateStatus('ready');
					}
					return template;
				}

				mfp.updateStatus('loading');
				item.loading = true;

				if(!item.hasSize) {
					item.imgHidden = true;
					template.addClass('mfp-loading');
					mfp.findImageSize(item);
				} 

				return template;
			}
		}
	});



	/*>>image*/

	/*>>zoom*/
	var hasMozTransform,
		getHasMozTransform = function() {
			if(hasMozTransform === undefined) {
				hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
			}
			return hasMozTransform;		
		};

	$.magnificPopup.registerModule('zoom', {

		options: {
			enabled: false,
			easing: 'ease-in-out',
			duration: 300,
			opener: function(element) {
				return element.is('img') ? element : element.find('img');
			}
		},

		proto: {

			initZoom: function() {
				var zoomSt = mfp.st.zoom,
					ns = '.zoom',
					image;
					
				if(!zoomSt.enabled || !mfp.supportsTransition) {
					return;
				}

				var duration = zoomSt.duration,
					getElToAnimate = function(image) {
						var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
							transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
							cssObj = {
								position: 'fixed',
								zIndex: 9999,
								left: 0,
								top: 0,
								'-webkit-backface-visibility': 'hidden'
							},
							t = 'transition';

						cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

						newImg.css(cssObj);
						return newImg;
					},
					showMainContent = function() {
						mfp.content.css('visibility', 'visible');
					},
					openTimeout,
					animatedImg;

				_mfpOn('BuildControls'+ns, function() {
					if(mfp._allowZoom()) {

						clearTimeout(openTimeout);
						mfp.content.css('visibility', 'hidden');

						// Basically, all code below does is clones existing image, puts in on top of the current one and animated it
						
						image = mfp._getItemToZoom();

						if(!image) {
							showMainContent();
							return;
						}

						animatedImg = getElToAnimate(image); 
						
						animatedImg.css( mfp._getOffset() );

						mfp.wrap.append(animatedImg);

						openTimeout = setTimeout(function() {
							animatedImg.css( mfp._getOffset( true ) );
							openTimeout = setTimeout(function() {

								showMainContent();

								setTimeout(function() {
									animatedImg.remove();
									image = animatedImg = null;
									_mfpTrigger('ZoomAnimationEnded');
								}, 16); // avoid blink when switching images 

							}, duration); // this timeout equals animation duration

						}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


						// Lots of timeouts...
					}
				});
				_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
					if(mfp._allowZoom()) {

						clearTimeout(openTimeout);

						mfp.st.removalDelay = duration;

						if(!image) {
							image = mfp._getItemToZoom();
							if(!image) {
								return;
							}
							animatedImg = getElToAnimate(image);
						}
						
						
						animatedImg.css( mfp._getOffset(true) );
						mfp.wrap.append(animatedImg);
						mfp.content.css('visibility', 'hidden');
						
						setTimeout(function() {
							animatedImg.css( mfp._getOffset() );
						}, 16);
					}

				});

				_mfpOn(CLOSE_EVENT+ns, function() {
					if(mfp._allowZoom()) {
						showMainContent();
						if(animatedImg) {
							animatedImg.remove();
						}
						image = null;
					}	
				});
			},

			_allowZoom: function() {
				return mfp.currItem.type === 'image';
			},

			_getItemToZoom: function() {
				if(mfp.currItem.hasSize) {
					return mfp.currItem.img;
				} else {
					return false;
				}
			},

			// Get element postion relative to viewport
			_getOffset: function(isLarge) {
				var el;
				if(isLarge) {
					el = mfp.currItem.img;
				} else {
					el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
				}

				var offset = el.offset();
				var paddingTop = parseInt(el.css('padding-top'),10);
				var paddingBottom = parseInt(el.css('padding-bottom'),10);
				offset.top -= ( $(window).scrollTop() - paddingTop );


				/*
				
				Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

				 */
				var obj = {
					width: el.width(),
					// fix Zepto height+padding issue
					height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
				};

				// I hate to do this, but there is no another option
				if( getHasMozTransform() ) {
					obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
				} else {
					obj.left = offset.left;
					obj.top = offset.top;
				}
				return obj;
			}

		}
	});



	/*>>zoom*/

	/*>>iframe*/

	var IFRAME_NS = 'iframe',
		_emptyPage = '//about:blank',
		
		_fixIframeBugs = function(isShowing) {
			if(mfp.currTemplate[IFRAME_NS]) {
				var el = mfp.currTemplate[IFRAME_NS].find('iframe');
				if(el.length) { 
					// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
					if(!isShowing) {
						el[0].src = _emptyPage;
					}

					// IE8 black screen bug fix
					if(mfp.isIE8) {
						el.css('display', isShowing ? 'block' : 'none');
					}
				}
			}
		};

	$.magnificPopup.registerModule(IFRAME_NS, {

		options: {
			markup: '<div class="mfp-iframe-scaler">'+
						'<div class="mfp-close"></div>'+
						'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
					'</div>',

			srcAction: 'iframe_src',

			// we don't care and support only one default type of URL by default
			patterns: {
				youtube: {
					index: 'youtube.com', 
					id: 'v=', 
					src: '//www.youtube.com/embed/%id%?autoplay=1'
				},
				vimeo: {
					index: 'vimeo.com/',
					id: '/',
					src: '//player.vimeo.com/video/%id%?autoplay=1'
				},
				gmaps: {
					index: '//maps.google.',
					src: '%id%&output=embed'
				}
			}
		},

		proto: {
			initIframe: function() {
				mfp.types.push(IFRAME_NS);

				_mfpOn('BeforeChange', function(e, prevType, newType) {
					if(prevType !== newType) {
						if(prevType === IFRAME_NS) {
							_fixIframeBugs(); // iframe if removed
						} else if(newType === IFRAME_NS) {
							_fixIframeBugs(true); // iframe is showing
						} 
					}// else {
						// iframe source is switched, don't do anything
					//}
				});

				_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
					_fixIframeBugs();
				});
			},

			getIframe: function(item, template) {
				var embedSrc = item.src;
				var iframeSt = mfp.st.iframe;
					
				$.each(iframeSt.patterns, function() {
					if(embedSrc.indexOf( this.index ) > -1) {
						if(this.id) {
							if(typeof this.id === 'string') {
								embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
							} else {
								embedSrc = this.id.call( this, embedSrc );
							}
						}
						embedSrc = this.src.replace('%id%', embedSrc );
						return false; // break;
					}
				});
				
				var dataObj = {};
				if(iframeSt.srcAction) {
					dataObj[iframeSt.srcAction] = embedSrc;
				}
				mfp._parseMarkup(template, dataObj, item);

				mfp.updateStatus('ready');

				return template;
			}
		}
	});



	/*>>iframe*/

	/*>>gallery*/
	/**
	 * Get looped index depending on number of slides
	 */
	var _getLoopedId = function(index) {
			var numSlides = mfp.items.length;
			if(index > numSlides - 1) {
				return index - numSlides;
			} else  if(index < 0) {
				return numSlides + index;
			}
			return index;
		},
		_replaceCurrTotal = function(text, curr, total) {
			return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
		};

	$.magnificPopup.registerModule('gallery', {

		options: {
			enabled: false,
			arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
			preload: [0,2],
			navigateByImgClick: true,
			arrows: true,

			tPrev: 'Previous (Left arrow key)',
			tNext: 'Next (Right arrow key)',
			tCounter: '%curr% of %total%'
		},

		proto: {
			initGallery: function() {

				var gSt = mfp.st.gallery,
					ns = '.mfp-gallery',
					supportsFastClick = Boolean($.fn.mfpFastClick);

				mfp.direction = true; // true - next, false - prev
				
				if(!gSt || !gSt.enabled ) return false;

				_wrapClasses += ' mfp-gallery';

				_mfpOn(OPEN_EVENT+ns, function() {

					if(gSt.navigateByImgClick) {
						mfp.wrap.on('click'+ns, '.mfp-img', function() {
							if(mfp.items.length > 1) {
								mfp.next();
								return false;
							}
						});
					}

					_document.on('keydown'+ns, function(e) {
						if (e.keyCode === 37) {
							mfp.prev();
						} else if (e.keyCode === 39) {
							mfp.next();
						}
					});
				});

				_mfpOn('UpdateStatus'+ns, function(e, data) {
					if(data.text) {
						data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
					}
				});

				_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
					var l = mfp.items.length;
					values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
				});

				_mfpOn('BuildControls' + ns, function() {
					if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
						var markup = gSt.arrowMarkup,
							arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),			
							arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

						var eName = supportsFastClick ? 'mfpFastClick' : 'click';
						arrowLeft[eName](function() {
							mfp.prev();
						});			
						arrowRight[eName](function() {
							mfp.next();
						});	

						// Polyfill for :before and :after (adds elements with classes mfp-a and mfp-b)
						if(mfp.isIE7) {
							_getEl('b', arrowLeft[0], false, true);
							_getEl('a', arrowLeft[0], false, true);
							_getEl('b', arrowRight[0], false, true);
							_getEl('a', arrowRight[0], false, true);
						}

						mfp.container.append(arrowLeft.add(arrowRight));
					}
				});

				_mfpOn(CHANGE_EVENT+ns, function() {
					if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

					mfp._preloadTimeout = setTimeout(function() {
						mfp.preloadNearbyImages();
						mfp._preloadTimeout = null;
					}, 16);		
				});


				_mfpOn(CLOSE_EVENT+ns, function() {
					_document.off(ns);
					mfp.wrap.off('click'+ns);
				
					if(mfp.arrowLeft && supportsFastClick) {
						mfp.arrowLeft.add(mfp.arrowRight).destroyMfpFastClick();
					}
					mfp.arrowRight = mfp.arrowLeft = null;
				});

			}, 
			next: function() {
				mfp.direction = true;
				mfp.index = _getLoopedId(mfp.index + 1);
				mfp.updateItemHTML();
			},
			prev: function() {
				mfp.direction = false;
				mfp.index = _getLoopedId(mfp.index - 1);
				mfp.updateItemHTML();
			},
			goTo: function(newIndex) {
				mfp.direction = (newIndex >= mfp.index);
				mfp.index = newIndex;
				mfp.updateItemHTML();
			},
			preloadNearbyImages: function() {
				var p = mfp.st.gallery.preload,
					preloadBefore = Math.min(p[0], mfp.items.length),
					preloadAfter = Math.min(p[1], mfp.items.length),
					i;

				for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
					mfp._preloadItem(mfp.index+i);
				}
				for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
					mfp._preloadItem(mfp.index-i);
				}
			},
			_preloadItem: function(index) {
				index = _getLoopedId(index);

				if(mfp.items[index].preloaded) {
					return;
				}

				var item = mfp.items[index];
				if(!item.parsed) {
					item = mfp.parseEl( index );
				}

				_mfpTrigger('LazyLoad', item);

				if(item.type === 'image') {
					item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
						item.hasSize = true;
					}).on('error.mfploader', function() {
						item.hasSize = true;
						item.loadError = true;
						_mfpTrigger('LazyLoadError', item);
					}).attr('src', item.src);
				}


				item.preloaded = true;
			}
		}
	});

	/*
	Touch Support that might be implemented some day

	addSwipeGesture: function() {
		var startX,
			moved,
			multipleTouches;

			return;

		var namespace = '.mfp',
			addEventNames = function(pref, down, move, up, cancel) {
				mfp._tStart = pref + down + namespace;
				mfp._tMove = pref + move + namespace;
				mfp._tEnd = pref + up + namespace;
				mfp._tCancel = pref + cancel + namespace;
			};

		if(window.navigator.msPointerEnabled) {
			addEventNames('MSPointer', 'Down', 'Move', 'Up', 'Cancel');
		} else if('ontouchstart' in window) {
			addEventNames('touch', 'start', 'move', 'end', 'cancel');
		} else {
			return;
		}
		_window.on(mfp._tStart, function(e) {
			var oE = e.originalEvent;
			multipleTouches = moved = false;
			startX = oE.pageX || oE.changedTouches[0].pageX;
		}).on(mfp._tMove, function(e) {
			if(e.originalEvent.touches.length > 1) {
				multipleTouches = e.originalEvent.touches.length;
			} else {
				//e.preventDefault();
				moved = true;
			}
		}).on(mfp._tEnd + ' ' + mfp._tCancel, function(e) {
			if(moved && !multipleTouches) {
				var oE = e.originalEvent,
					diff = startX - (oE.pageX || oE.changedTouches[0].pageX);

				if(diff > 20) {
					mfp.next();
				} else if(diff < -20) {
					mfp.prev();
				}
			}
		});
	},
	*/


	/*>>gallery*/

	/*>>retina*/

	var RETINA_NS = 'retina';

	$.magnificPopup.registerModule(RETINA_NS, {
		options: {
			replaceSrc: function(item) {
				return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
			},
			ratio: 1 // Function or number.  Set to 1 to disable.
		},
		proto: {
			initRetina: function() {
				if(window.devicePixelRatio > 1) {

					var st = mfp.st.retina,
						ratio = st.ratio;

					ratio = !isNaN(ratio) ? ratio : ratio();

					if(ratio > 1) {
						_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
							item.img.css({
								'max-width': item.img[0].naturalWidth / ratio,
								'width': '100%'
							});
						});
						_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
							item.src = st.replaceSrc(item, ratio);
						});
					}
				}

			}
		}
	});

	(function() {
		var ghostClickDelay = 1000,
			supportsTouch = 'ontouchstart' in window,
			unbindTouchMove = function() {
				_window.off('touchmove'+ns+' touchend'+ns);
			},
			eName = 'mfpFastClick',
			ns = '.'+eName;


		// As Zepto.js doesn't have an easy way to add custom events (like jQuery), so we implement it in this way
		$.fn.mfpFastClick = function(callback) {

			return $(this).each(function() {

				var elem = $(this),
					lock;

				if( supportsTouch ) {

					var timeout,
						startX,
						startY,
						pointerMoved,
						point,
						numPointers;

					elem.on('touchstart' + ns, function(e) {
						pointerMoved = false;
						numPointers = 1;

						point = e.originalEvent ? e.originalEvent.touches[0] : e.touches[0];
						startX = point.clientX;
						startY = point.clientY;

						_window.on('touchmove'+ns, function(e) {
							point = e.originalEvent ? e.originalEvent.touches : e.touches;
							numPointers = point.length;
							point = point[0];
							if (Math.abs(point.clientX - startX) > 10 ||
								Math.abs(point.clientY - startY) > 10) {
								pointerMoved = true;
								unbindTouchMove();
							}
						}).on('touchend'+ns, function(e) {
							unbindTouchMove();
							if(pointerMoved || numPointers > 1) {
								return;
							}
							lock = true;
							e.preventDefault();
							clearTimeout(timeout);
							timeout = setTimeout(function() {
								lock = false;
							}, ghostClickDelay);
							callback();
						});
					});

				}

				elem.on('click' + ns, function() {
					if(!lock) {
						callback();
					}
				});
			});
		};

		$.fn.destroyMfpFastClick = function() {
			$(this).off('touchstart' + ns + ' click' + ns);
			if(supportsTouch) _window.off('touchmove'+ns+' touchend'+ns);
		};
	})();

	/*>>fastclick*/
	 _checkInstance(); })(window.jQuery || window.Zepto);

	 /*
	 * jQuery FlexSlider v2.5.0
	 * Copyright 2012 WooThemes
	 * Contributing Author: Tyler Smith
	 */
	;
	(function ($) {

	  //FlexSlider: Object Instance
	  $.flexslider = function(el, options) {
	    var slider = $(el);

	    // making variables public
	    slider.vars = $.extend({}, $.flexslider.defaults, options);

	    var namespace = slider.vars.namespace,
	        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
	        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
	        // depricating this idea, as devices are being released with both of these events
	        //eventType = (touch) ? "touchend" : "click",
	        eventType = "click touchend MSPointerUp keyup",
	        watchedEvent = "",
	        watchedEventClearTimer,
	        vertical = slider.vars.direction === "vertical",
	        reverse = slider.vars.reverse,
	        carousel = (slider.vars.itemWidth > 0),
	        fade = slider.vars.animation === "fade",
	        asNav = slider.vars.asNavFor !== "",
	        methods = {},
	        focused = true;

	    // Store a reference to the slider object
	    $.data(el, "flexslider", slider);

	    // Private slider methods
	    methods = {
	      init: function() {
	        slider.animating = false;
	        // Get current slide and make sure it is a number
	        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
	        if ( isNaN( slider.currentSlide ) ) { slider.currentSlide = 0; }
	        slider.animatingTo = slider.currentSlide;
	        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
	        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
	        slider.slides = $(slider.vars.selector, slider);
	        slider.container = $(slider.containerSelector, slider);
	        slider.count = slider.slides.length;
	        // SYNC:
	        slider.syncExists = $(slider.vars.sync).length > 0;
	        // SLIDE:
	        if (slider.vars.animation === "slide") { slider.vars.animation = "swing"; }
	        slider.prop = (vertical) ? "top" : "marginLeft";
	        slider.args = {};
	        // SLIDESHOW:
	        slider.manualPause = false;
	        slider.stopped = false;
	        //PAUSE WHEN INVISIBLE
	        slider.started = false;
	        slider.startTimeout = null;
	        // TOUCH/USECSS:
	        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
	          var obj = document.createElement('div'),
	              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
	          for (var i in props) {
	            if ( obj.style[ props[i] ] !== undefined ) {
	              slider.pfx = props[i].replace('Perspective','').toLowerCase();
	              slider.prop = "-" + slider.pfx + "-transform";
	              return true;
	            }
	          }
	          return false;
	        }());
	        slider.ensureAnimationEnd = '';
	        // CONTROLSCONTAINER:
	        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
	        // MANUAL:
	        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

	        // CUSTOM DIRECTION NAV:
	        if (slider.vars.customDirectionNav !== "") slider.customDirectionNav = $(slider.vars.customDirectionNav).length === 2 && $(slider.vars.customDirectionNav);

	        // RANDOMIZE:
	        if (slider.vars.randomize) {
	          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
	          slider.container.empty().append(slider.slides);
	        }

	        slider.doMath();

	        // INIT
	        slider.setup("init");

	        // CONTROLNAV:
	        if (slider.vars.controlNav) { methods.controlNav.setup(); }

	        // DIRECTIONNAV:
	        if (slider.vars.directionNav) { methods.directionNav.setup(); }

	        // KEYBOARD:
	        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
	          $(document).bind('keyup', function(event) {
	            var keycode = event.keyCode;
	            if (!slider.animating && (keycode === 39 || keycode === 37)) {
	              var target = (keycode === 39) ? slider.getTarget('next') :
	                           (keycode === 37) ? slider.getTarget('prev') : false;
	              slider.flexAnimate(target, slider.vars.pauseOnAction);
	            }
	          });
	        }
	        // MOUSEWHEEL:
	        if (slider.vars.mousewheel) {
	          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
	            event.preventDefault();
	            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
	            slider.flexAnimate(target, slider.vars.pauseOnAction);
	          });
	        }

	        // PAUSEPLAY
	        if (slider.vars.pausePlay) { methods.pausePlay.setup(); }

	        //PAUSE WHEN INVISIBLE
	        if (slider.vars.slideshow && slider.vars.pauseInvisible) { methods.pauseInvisible.init(); }

	        // SLIDSESHOW
	        if (slider.vars.slideshow) {
	          if (slider.vars.pauseOnHover) {
	            slider.hover(function() {
	              if (!slider.manualPlay && !slider.manualPause) { slider.pause(); }
	            }, function() {
	              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) { slider.play(); }
	            });
	          }
	          // initialize animation
	          //If we're visible, or we don't use PageVisibility API
	          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
	            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
	          }
	        }

	        // ASNAV:
	        if (asNav) { methods.asNav.setup(); }

	        // TOUCH
	        if (touch && slider.vars.touch) { methods.touch(); }

	        // FADE&&SMOOTHHEIGHT || SLIDE:
	        if (!fade || (fade && slider.vars.smoothHeight)) { $(window).bind("resize orientationchange focus", methods.resize); }

	        slider.find("img").attr("draggable", "false");

	        // API: start() Callback
	        setTimeout(function(){
	          slider.vars.start(slider);
	        }, 200);
	      },
	      asNav: {
	        setup: function() {
	          slider.asNav = true;
	          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
	          slider.currentItem = slider.currentSlide;
	          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
	          if(!msGesture){
	              slider.slides.on(eventType, function(e){
	                e.preventDefault();
	                var $slide = $(this),
	                    target = $slide.index();
	                var posFromLeft = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
	                if( posFromLeft <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
	                  slider.flexAnimate(slider.getTarget("prev"), true);
	                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
	                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
	                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
	                }
	              });
	          }else{
	              el._slider = slider;
	              slider.slides.each(function (){
	                  var that = this;
	                  that._gesture = new MSGesture();
	                  that._gesture.target = that;
	                  that.addEventListener("MSPointerDown", function (e){
	                      e.preventDefault();
	                      if(e.currentTarget._gesture) {
	                        e.currentTarget._gesture.addPointer(e.pointerId);
	                      }
	                  }, false);
	                  that.addEventListener("MSGestureTap", function (e){
	                      e.preventDefault();
	                      var $slide = $(this),
	                          target = $slide.index();
	                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
	                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
	                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
	                      }
	                  });
	              });
	          }
	        }
	      },
	      controlNav: {
	        setup: function() {
	          if (!slider.manualControls) {
	            methods.controlNav.setupPaging();
	          } else { // MANUALCONTROLS:
	            methods.controlNav.setupManual();
	          }
	        },
	        setupPaging: function() {
	          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
	              j = 1,
	              item,
	              slide;

	          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

	          if (slider.pagingCount > 1) {
	            for (var i = 0; i < slider.pagingCount; i++) {
	              slide = slider.slides.eq(i);
	              item = (slider.vars.controlNav === "thumbnails") ? '<img src="' + slide.attr( 'data-thumb' ) + '"/>' : '<a>' + j + '</a>';
	              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
	                var captn = slide.attr( 'data-thumbcaption' );
	                if ( '' !== captn && undefined !== captn ) { item += '<span class="' + namespace + 'caption">' + captn + '</span>'; }
	              }
	              slider.controlNavScaffold.append('<li>' + item + '</li>');
	              j++;
	            }
	          }

	          // CONTROLSCONTAINER:
	          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
	          methods.controlNav.set();

	          methods.controlNav.active();

	          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
	            event.preventDefault();

	            if (watchedEvent === "" || watchedEvent === event.type) {
	              var $this = $(this),
	                  target = slider.controlNav.index($this);

	              if (!$this.hasClass(namespace + 'active')) {
	                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
	                slider.flexAnimate(target, slider.vars.pauseOnAction);
	              }
	            }

	            // setup flags to prevent event duplication
	            if (watchedEvent === "") {
	              watchedEvent = event.type;
	            }
	            methods.setToClearWatchedEvent();

	          });
	        },
	        setupManual: function() {
	          slider.controlNav = slider.manualControls;
	          methods.controlNav.active();

	          slider.controlNav.bind(eventType, function(event) {
	            event.preventDefault();

	            if (watchedEvent === "" || watchedEvent === event.type) {
	              var $this = $(this),
	                  target = slider.controlNav.index($this);

	              if (!$this.hasClass(namespace + 'active')) {
	                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
	                slider.flexAnimate(target, slider.vars.pauseOnAction);
	              }
	            }

	            // setup flags to prevent event duplication
	            if (watchedEvent === "") {
	              watchedEvent = event.type;
	            }
	            methods.setToClearWatchedEvent();
	          });
	        },
	        set: function() {
	          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
	          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
	        },
	        active: function() {
	          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
	        },
	        update: function(action, pos) {
	          if (slider.pagingCount > 1 && action === "add") {
	            slider.controlNavScaffold.append($('<li><a>' + slider.count + '</a></li>'));
	          } else if (slider.pagingCount === 1) {
	            slider.controlNavScaffold.find('li').remove();
	          } else {
	            slider.controlNav.eq(pos).closest('li').remove();
	          }
	          methods.controlNav.set();
	          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
	        }
	      },
	      directionNav: {
	        setup: function() {
	          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li class="' + namespace + 'nav-prev"><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li class="' + namespace + 'nav-next"><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

	          // CUSTOM DIRECTION NAV:
	          if (slider.customDirectionNav) {
	            slider.directionNav = slider.customDirectionNav;
	          // CONTROLSCONTAINER:
	          } else if (slider.controlsContainer) {
	            $(slider.controlsContainer).append(directionNavScaffold);
	            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
	          } else {
	            slider.append(directionNavScaffold);
	            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
	          }

	          methods.directionNav.update();

	          slider.directionNav.bind(eventType, function(event) {
	            event.preventDefault();
	            var target;

	            if (watchedEvent === "" || watchedEvent === event.type) {
	              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
	              slider.flexAnimate(target, slider.vars.pauseOnAction);
	            }

	            // setup flags to prevent event duplication
	            if (watchedEvent === "") {
	              watchedEvent = event.type;
	            }
	            methods.setToClearWatchedEvent();
	          });
	        },
	        update: function() {
	          var disabledClass = namespace + 'disabled';
	          if (slider.pagingCount === 1) {
	            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
	          } else if (!slider.vars.animationLoop) {
	            if (slider.animatingTo === 0) {
	              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
	            } else if (slider.animatingTo === slider.last) {
	              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
	            } else {
	              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
	            }
	          } else {
	            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
	          }
	        }
	      },
	      pausePlay: {
	        setup: function() {
	          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a></a></div>');

	          // CONTROLSCONTAINER:
	          if (slider.controlsContainer) {
	            slider.controlsContainer.append(pausePlayScaffold);
	            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
	          } else {
	            slider.append(pausePlayScaffold);
	            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
	          }

	          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

	          slider.pausePlay.bind(eventType, function(event) {
	            event.preventDefault();

	            if (watchedEvent === "" || watchedEvent === event.type) {
	              if ($(this).hasClass(namespace + 'pause')) {
	                slider.manualPause = true;
	                slider.manualPlay = false;
	                slider.pause();
	              } else {
	                slider.manualPause = false;
	                slider.manualPlay = true;
	                slider.play();
	              }
	            }

	            // setup flags to prevent event duplication
	            if (watchedEvent === "") {
	              watchedEvent = event.type;
	            }
	            methods.setToClearWatchedEvent();
	          });
	        },
	        update: function(state) {
	          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
	        }
	      },
	      touch: function() {
	        var startX,
	          startY,
	          offset,
	          cwidth,
	          dx,
	          startT,
	          onTouchStart,
	          onTouchMove,
	          onTouchEnd,
	          scrolling = false,
	          localX = 0,
	          localY = 0,
	          accDx = 0;

	        if(!msGesture){
	            onTouchStart = function(e) {
	              if (slider.animating) {
	                e.preventDefault();
	              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
	                slider.pause();
	                // CAROUSEL:
	                cwidth = (vertical) ? slider.h : slider. w;
	                startT = Number(new Date());
	                // CAROUSEL:

	                // Local vars for X and Y points.
	                localX = e.touches[0].pageX;
	                localY = e.touches[0].pageY;

	                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
	                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
	                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
	                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
	                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
	                startX = (vertical) ? localY : localX;
	                startY = (vertical) ? localX : localY;

	                el.addEventListener('touchmove', onTouchMove, false);
	                el.addEventListener('touchend', onTouchEnd, false);
	              }
	            };

	            onTouchMove = function(e) {
	              // Local vars for X and Y points.

	              localX = e.touches[0].pageX;
	              localY = e.touches[0].pageY;

	              dx = (vertical) ? startX - localY : startX - localX;
	              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));

	              var fxms = 500;

	              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
	                e.preventDefault();
	                if (!fade && slider.transitions) {
	                  if (!slider.vars.animationLoop) {
	                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
	                  }
	                  slider.setProps(offset + dx, "setTouch");
	                }
	              }
	            };

	            onTouchEnd = function(e) {
	              // finish the touch by undoing the touch session
	              el.removeEventListener('touchmove', onTouchMove, false);

	              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
	                var updateDx = (reverse) ? -dx : dx,
	                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

	                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
	                  slider.flexAnimate(target, slider.vars.pauseOnAction);
	                } else {
	                  if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
	                }
	              }
	              el.removeEventListener('touchend', onTouchEnd, false);

	              startX = null;
	              startY = null;
	              dx = null;
	              offset = null;
	            };

	            el.addEventListener('touchstart', onTouchStart, false);
	        }else{
	            el.style.msTouchAction = "none";
	            el._gesture = new MSGesture();
	            el._gesture.target = el;
	            el.addEventListener("MSPointerDown", onMSPointerDown, false);
	            el._slider = slider;
	            el.addEventListener("MSGestureChange", onMSGestureChange, false);
	            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

	            function onMSPointerDown(e){
	                e.stopPropagation();
	                if (slider.animating) {
	                    e.preventDefault();
	                }else{
	                    slider.pause();
	                    el._gesture.addPointer(e.pointerId);
	                    accDx = 0;
	                    cwidth = (vertical) ? slider.h : slider. w;
	                    startT = Number(new Date());
	                    // CAROUSEL:

	                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
	                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
	                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
	                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
	                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
	                }
	            }

	            function onMSGestureChange(e) {
	                e.stopPropagation();
	                var slider = e.target._slider;
	                if(!slider){
	                    return;
	                }
	                var transX = -e.translationX,
	                    transY = -e.translationY;

	                //Accumulate translations.
	                accDx = accDx + ((vertical) ? transY : transX);
	                dx = accDx;
	                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

	                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
	                    setImmediate(function (){
	                        el._gesture.stop();
	                    });

	                    return;
	                }

	                if (!scrolling || Number(new Date()) - startT > 500) {
	                    e.preventDefault();
	                    if (!fade && slider.transitions) {
	                        if (!slider.vars.animationLoop) {
	                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
	                        }
	                        slider.setProps(offset + dx, "setTouch");
	                    }
	                }
	            }

	            function onMSGestureEnd(e) {
	                e.stopPropagation();
	                var slider = e.target._slider;
	                if(!slider){
	                    return;
	                }
	                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
	                    var updateDx = (reverse) ? -dx : dx,
	                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

	                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
	                        slider.flexAnimate(target, slider.vars.pauseOnAction);
	                    } else {
	                        if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
	                    }
	                }

	                startX = null;
	                startY = null;
	                dx = null;
	                offset = null;
	                accDx = 0;
	            }
	        }
	      },
	      resize: function() {
	        if (!slider.animating && slider.is(':visible')) {
	          if (!carousel) { slider.doMath(); }

	          if (fade) {
	            // SMOOTH HEIGHT:
	            methods.smoothHeight();
	          } else if (carousel) { //CAROUSEL:
	            slider.slides.width(slider.computedW);
	            slider.update(slider.pagingCount);
	            slider.setProps();
	          }
	          else if (vertical) { //VERTICAL:
	            slider.viewport.height(slider.h);
	            slider.setProps(slider.h, "setTotal");
	          } else {
	            // SMOOTH HEIGHT:
	            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
	            slider.newSlides.width(slider.computedW);
	            slider.setProps(slider.computedW, "setTotal");
	          }
	        }
	      },
	      smoothHeight: function(dur) {
	        if (!vertical || fade) {
	          var $obj = (fade) ? slider : slider.viewport;
	          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).height()}, dur) : $obj.height(slider.slides.eq(slider.animatingTo).height());
	        }
	      },
	      sync: function(action) {
	        var $obj = $(slider.vars.sync).data("flexslider"),
	            target = slider.animatingTo;

	        switch (action) {
	          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
	          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
	          case "pause": $obj.pause(); break;
	        }
	      },
	      uniqueID: function($clone) {
	        // Append _clone to current level and children elements with id attributes
	        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
	          var $this = $(this);
	          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
	        });
	        return $clone;
	      },
	      pauseInvisible: {
	        visProp: null,
	        init: function() {
	          var visProp = methods.pauseInvisible.getHiddenProp();
	          if (visProp) {
	            var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
	            document.addEventListener(evtname, function() {
	              if (methods.pauseInvisible.isHidden()) {
	                if(slider.startTimeout) {
	                  clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
	                } else { 
	                  slider.pause(); //Or just pause
	                }
	              }
	              else {
	                if(slider.started) {
	                  slider.play(); //Initiated before, just play
	                } else { 
	                  if (slider.vars.initDelay > 0) { 
	                    setTimeout(slider.play, slider.vars.initDelay);
	                  } else {
	                    slider.play(); //Didn't init before: simply init or wait for it
	                  } 
	                }
	              }
	            });
	          }
	        },
	        isHidden: function() {
	          var prop = methods.pauseInvisible.getHiddenProp();
	          if (!prop) {
	            return false;
	          }
	          return document[prop];
	        },
	        getHiddenProp: function() {
	          var prefixes = ['webkit','moz','ms','o'];
	          // if 'hidden' is natively supported just return it
	          if ('hidden' in document) {
	            return 'hidden';
	          }
	          // otherwise loop over all the known prefixes until we find one
	          for ( var i = 0; i < prefixes.length; i++ ) {
	              if ((prefixes[i] + 'Hidden') in document) {
	                return prefixes[i] + 'Hidden';
	              }
	          }
	          // otherwise it's not supported
	          return null;
	        }
	      },
	      setToClearWatchedEvent: function() {
	        clearTimeout(watchedEventClearTimer);
	        watchedEventClearTimer = setTimeout(function() {
	          watchedEvent = "";
	        }, 3000);
	      }
	    };

	    // public methods
	    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
	      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
	        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
	      }

	      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

	      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
	        if (asNav && withSync) {
	          var master = $(slider.vars.asNavFor).data('flexslider');
	          slider.atEnd = target === 0 || target === slider.count - 1;
	          master.flexAnimate(target, true, false, true, fromNav);
	          slider.direction = (slider.currentItem < target) ? "next" : "prev";
	          master.direction = slider.direction;

	          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
	            slider.currentItem = target;
	            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
	            target = Math.floor(target/slider.visible);
	          } else {
	            slider.currentItem = target;
	            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
	            return false;
	          }
	        }

	        slider.animating = true;
	        slider.animatingTo = target;

	        // SLIDESHOW:
	        if (pause) { slider.pause(); }

	        // API: before() animation Callback
	        slider.vars.before(slider);

	        // SYNC:
	        if (slider.syncExists && !fromNav) { methods.sync("animate"); }

	        // CONTROLNAV
	        if (slider.vars.controlNav) { methods.controlNav.active(); }

	        // !CAROUSEL:
	        // CANDIDATE: slide active class (for add/remove slide)
	        if (!carousel) { slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide'); }

	        // INFINITE LOOP:
	        // CANDIDATE: atEnd
	        slider.atEnd = target === 0 || target === slider.last;

	        // DIRECTIONNAV:
	        if (slider.vars.directionNav) { methods.directionNav.update(); }

	        if (target === slider.last) {
	          // API: end() of cycle Callback
	          slider.vars.end(slider);
	          // SLIDESHOW && !INFINITE LOOP:
	          if (!slider.vars.animationLoop) { slider.pause(); }
	        }

	        // SLIDE:
	        if (!fade) {
	          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
	              margin, slideString, calcNext;

	          // INFINITE LOOP / REVERSE:
	          if (carousel) {
	            //margin = (slider.vars.itemWidth > slider.w) ? slider.vars.itemMargin * 2 : slider.vars.itemMargin;
	            margin = slider.vars.itemMargin;
	            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
	            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
	          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
	            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
	          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
	            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
	          } else {
	            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
	          }
	          slider.setProps(slideString, "", slider.vars.animationSpeed);
	          if (slider.transitions) {
	            if (!slider.vars.animationLoop || !slider.atEnd) {
	              slider.animating = false;
	              slider.currentSlide = slider.animatingTo;
	            }
	            
	            // Unbind previous transitionEnd events and re-bind new transitionEnd event
	            slider.container.unbind("webkitTransitionEnd transitionend");
	            slider.container.bind("webkitTransitionEnd transitionend", function() {
	              clearTimeout(slider.ensureAnimationEnd);
	              slider.wrapup(dimension);
	            });

	            // Insurance for the ever-so-fickle transitionEnd event
	            clearTimeout(slider.ensureAnimationEnd);
	            slider.ensureAnimationEnd = setTimeout(function() {
	              slider.wrapup(dimension);
	            }, slider.vars.animationSpeed + 100);

	          } else {
	            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
	              slider.wrapup(dimension);
	            });
	          }
	        } else { // FADE:
	          if (!touch) {
	            //slider.slides.eq(slider.currentSlide).fadeOut(slider.vars.animationSpeed, slider.vars.easing);
	            //slider.slides.eq(target).fadeIn(slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

	            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
	            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);

	          } else {
	            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
	            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
	            slider.wrapup(dimension);
	          }
	        }
	        // SMOOTH HEIGHT:
	        if (slider.vars.smoothHeight) { methods.smoothHeight(slider.vars.animationSpeed); }
	      }
	    };
	    slider.wrapup = function(dimension) {
	      // SLIDE:
	      if (!fade && !carousel) {
	        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
	          slider.setProps(dimension, "jumpEnd");
	        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
	          slider.setProps(dimension, "jumpStart");
	        }
	      }
	      slider.animating = false;
	      slider.currentSlide = slider.animatingTo;
	      // API: after() animation Callback
	      slider.vars.after(slider);
	    };

	    // SLIDESHOW:
	    slider.animateSlides = function() {
	      if (!slider.animating && focused ) { slider.flexAnimate(slider.getTarget("next")); }
	    };
	    // SLIDESHOW:
	    slider.pause = function() {
	      clearInterval(slider.animatedSlides);
	      slider.animatedSlides = null;
	      slider.playing = false;
	      // PAUSEPLAY:
	      if (slider.vars.pausePlay) { methods.pausePlay.update("play"); }
	      // SYNC:
	      if (slider.syncExists) { methods.sync("pause"); }
	    };
	    // SLIDESHOW:
	    slider.play = function() {
	      if (slider.playing) { clearInterval(slider.animatedSlides); }
	      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
	      slider.started = slider.playing = true;
	      // PAUSEPLAY:
	      if (slider.vars.pausePlay) { methods.pausePlay.update("pause"); }
	      // SYNC:
	      if (slider.syncExists) { methods.sync("play"); }
	    };
	    // STOP:
	    slider.stop = function () {
	      slider.pause();
	      slider.stopped = true;
	    };
	    slider.canAdvance = function(target, fromNav) {
	      // ASNAV:
	      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
	      return (fromNav) ? true :
	             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
	             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
	             (target === slider.currentSlide && !asNav) ? false :
	             (slider.vars.animationLoop) ? true :
	             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
	             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
	             true;
	    };
	    slider.getTarget = function(dir) {
	      slider.direction = dir;
	      if (dir === "next") {
	        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
	      } else {
	        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
	      }
	    };

	    // SLIDE:
	    slider.setProps = function(pos, special, dur) {
	      var target = (function() {
	        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
	            posCalc = (function() {
	              if (carousel) {
	                return (special === "setTouch") ? pos :
	                       (reverse && slider.animatingTo === slider.last) ? 0 :
	                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
	                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
	              } else {
	                switch (special) {
	                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
	                  case "setTouch": return (reverse) ? pos : pos;
	                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
	                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
	                  default: return pos;
	                }
	              }
	            }());

	            return (posCalc * -1) + "px";
	          }());

	      if (slider.transitions) {
	        target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + target + ",0,0)";
	        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
	        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
	         slider.container.css("transition-duration", dur);
	      }

	      slider.args[slider.prop] = target;
	      if (slider.transitions || dur === undefined) { slider.container.css(slider.args); }

	      slider.container.css('transform',target);
	    };

	    slider.setup = function(type) {
	      // SLIDE:
	      if (!fade) {
	        var sliderOffset, arr;

	        if (type === "init") {
	          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
	          // INFINITE LOOP:
	          slider.cloneCount = 0;
	          slider.cloneOffset = 0;
	          // REVERSE:
	          if (reverse) {
	            arr = $.makeArray(slider.slides).reverse();
	            slider.slides = $(arr);
	            slider.container.empty().append(slider.slides);
	          }
	        }
	        // INFINITE LOOP && !CAROUSEL:
	        if (slider.vars.animationLoop && !carousel) {
	          slider.cloneCount = 2;
	          slider.cloneOffset = 1;
	          // clear out old clones
	          if (type !== "init") { slider.container.find('.clone').remove(); }
	          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
	                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
	        }
	        slider.newSlides = $(slider.vars.selector, slider);

	        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
	        // VERTICAL:
	        if (vertical && !carousel) {
	          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
	          setTimeout(function(){
	            slider.newSlides.css({"display": "block"});
	            slider.doMath();
	            slider.viewport.height(slider.h);
	            slider.setProps(sliderOffset * slider.h, "init");
	          }, (type === "init") ? 100 : 0);
	        } else {
	          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
	          slider.setProps(sliderOffset * slider.computedW, "init");
	          setTimeout(function(){
	            slider.doMath();
	            slider.newSlides.css({"width": slider.computedW, "float": "left", "display": "block"});
	            // SMOOTH HEIGHT:
	            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
	          }, (type === "init") ? 100 : 0);
	        }
	      } else { // FADE:
	        slider.slides.css({"width": "100%", "float": "left", "marginRight": "-100%", "position": "relative"});
	        if (type === "init") {
	          if (!touch) {
	            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
	            if (slider.vars.fadeFirstSlide == false) {
	              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
	            } else {
	              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
	            }
	          } else {
	            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
	          }
	        }
	        // SMOOTH HEIGHT:
	        if (slider.vars.smoothHeight) { methods.smoothHeight(); }
	      }
	      // !CAROUSEL:
	      // CANDIDATE: active slide
	      if (!carousel) { slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide"); }

	      //FlexSlider: init() Callback
	      slider.vars.init(slider);
	    };

	    slider.doMath = function() {
	      var slide = slider.slides.first(),
	          slideMargin = slider.vars.itemMargin,
	          minItems = slider.vars.minItems,
	          maxItems = slider.vars.maxItems;

	      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
	      slider.h = slide.height();
	      slider.boxPadding = slide.outerWidth() - slide.width();

	      // CAROUSEL:
	      if (carousel) {
	        slider.itemT = slider.vars.itemWidth + slideMargin;
	        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
	        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
	        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
	                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
	                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

	        slider.visible = Math.floor(slider.w/(slider.itemW));
	        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
	        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
	        slider.last =  slider.pagingCount - 1;
	        slider.limit = (slider.pagingCount === 1) ? 0 :
	                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
	      } else {
	        slider.itemW = slider.w;
	        slider.pagingCount = slider.count;
	        slider.last = slider.count - 1;
	      }
	      slider.computedW = slider.itemW - slider.boxPadding;
	    };

	    slider.update = function(pos, action) {
	      slider.doMath();

	      // update currentSlide and slider.animatingTo if necessary
	      if (!carousel) {
	        if (pos < slider.currentSlide) {
	          slider.currentSlide += 1;
	        } else if (pos <= slider.currentSlide && pos !== 0) {
	          slider.currentSlide -= 1;
	        }
	        slider.animatingTo = slider.currentSlide;
	      }

	      // update controlNav
	      if (slider.vars.controlNav && !slider.manualControls) {
	        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
	          methods.controlNav.update("add");
	        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
	          if (carousel && slider.currentSlide > slider.last) {
	            slider.currentSlide -= 1;
	            slider.animatingTo -= 1;
	          }
	          methods.controlNav.update("remove", slider.last);
	        }
	      }
	      // update directionNav
	      if (slider.vars.directionNav) { methods.directionNav.update(); }

	    };

	    slider.addSlide = function(obj, pos) {
	      var $obj = $(obj);

	      slider.count += 1;
	      slider.last = slider.count - 1;

	      // append new slide
	      if (vertical && reverse) {
	        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
	      } else {
	        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
	      }

	      // update currentSlide, animatingTo, controlNav, and directionNav
	      slider.update(pos, "add");

	      // update slider.slides
	      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
	      // re-setup the slider to accomdate new slide
	      slider.setup();

	      //FlexSlider: added() Callback
	      slider.vars.added(slider);
	    };
	    slider.removeSlide = function(obj) {
	      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

	      // update count
	      slider.count -= 1;
	      slider.last = slider.count - 1;

	      // remove slide
	      if (isNaN(obj)) {
	        $(obj, slider.slides).remove();
	      } else {
	        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
	      }

	      // update currentSlide, animatingTo, controlNav, and directionNav
	      slider.doMath();
	      slider.update(pos, "remove");

	      // update slider.slides
	      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
	      // re-setup the slider to accomdate new slide
	      slider.setup();

	      // FlexSlider: removed() Callback
	      slider.vars.removed(slider);
	    };

	    //FlexSlider: Initialize
	    methods.init();
	  };

	  // Ensure the slider isn't focussed if the window loses focus.
	  $( window ).blur( function ( e ) {
	    focused = false;
	  }).focus( function ( e ) {
	    focused = true;
	  });

	  //FlexSlider: Default Settings
	  $.flexslider.defaults = {
	    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
	    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
	    animation: "fade",              //String: Select your animation type, "fade" or "slide"
	    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
	    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
	    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
	    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
	    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
	    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
	    slideshow: true,                //Boolean: Animate slider automatically
	    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
	    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
	    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
	    randomize: false,               //Boolean: Randomize slide order
	    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
	    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

	    // Usability features
	    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
	    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
	    pauseInvisible: true,   		//{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
	    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
	    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
	    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

	    // Primary Controls
	    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
	    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
	    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
	    nextText: "Next",               //String: Set the text for the "next" directionNav item

	    // Secondary Navigation
	    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
	    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
	    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
	    pausePlay: false,               //Boolean: Create pause/play dynamic element
	    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
	    playText: "Play",               //String: Set the text for the "play" pausePlay item

	    // Special properties
	    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
	    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
	    customDirectionNav: "",         //{NEW} jQuery Object/Selector: Custom prev / next button. Must be two jQuery elements. In order to make the events work they have to have the classes "prev" and "next" (plus namespace)
	    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
	    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

	    // Carousel Options
	    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
	    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
	    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
	    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
	    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
	    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

	    // Callback API
	    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
	    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
	    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
	    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
	    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
	    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
	    init: function() {}             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
	  };

	  //FlexSlider: Plugin Function
	  $.fn.flexslider = function(options) {
	    if (options === undefined) { options = {}; }

	    if (typeof options === "object") {
	      return this.each(function() {
	        var $this = $(this),
	            selector = (options.selector) ? options.selector : ".slides > li",
	            $slides = $this.find(selector);

	      if ( ( $slides.length === 1 && options.allowOneSlide === true ) || $slides.length === 0 ) {
	          $slides.fadeIn(400);
	          if (options.start) { options.start($this); }
	        } else if ($this.data('flexslider') === undefined) {
	          new $.flexslider(this, options);
	        }
	      });
	    } else {
	      // Helper strings to quickly perform functions on the slider
	      var $slider = $(this).data('flexslider');
	      switch (options) {
	        case "play": $slider.play(); break;
	        case "pause": $slider.pause(); break;
	        case "stop": $slider.stop(); break;
	        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
	        case "prev":
	        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
	        default: if (typeof options === "number") { $slider.flexAnimate(options, true); }
	      }
	    }
	  };
	})(jQuery);


	/*
	* File: jquery.flexisel.js
	* Version: 1.0.0
	* Description: Responsive carousel jQuery plugin
	* Author: 9bit Studios
	* Copyright 2012, 9bit Studios
	* http://www.9bitstudios.com
	* Free to use and abuse under the MIT license.
	* http://www.opensource.org/licenses/mit-license.php
	*/

	(function ($) {

	    $.fn.flexisel = function (options) {

	        var defaults = $.extend({
	    		visibleItems: 4,
	    		animationSpeed: 200,
	    		autoPlay: false,
	    		autoPlaySpeed: 3000,    		
	    		pauseOnHover: true,
				setMaxWidthAndHeight: false,
	    		enableResponsiveBreakpoints: false,
	    		responsiveBreakpoints: { 
		    		portrait: { 
		    			changePoint:480,
		    			visibleItems: 1
		    		}, 
		    		landscape: { 
		    			changePoint:640,
		    			visibleItems: 2
		    		},
		    		tablet: { 
		    			changePoint:768,
		    			visibleItems: 3
		    		}
	        	}
	        }, options);
	        
			/******************************
			Private Variables
			*******************************/         
	        
	        var object = $(this);
			var settings = $.extend(defaults, options);        
			var itemsWidth; // Declare the global width of each item in carousel
			var canNavigate = true; 
	        var itemsVisible = settings.visibleItems; 
	        
			/******************************
			Public Methods
			*******************************/        
	        
	        var methods = {
	        		
				init: function() {
					
	        		return this.each(function () {
	        			methods.appendHTML();
	        			methods.setEventHandlers();      			
	        			methods.initializeItems();
					});
				},

				/******************************
				Initialize Items
				*******************************/			
				
				initializeItems: function() {
					
					var listParent = object.parent();
					var innerHeight = listParent.height(); 
					var childSet = object.children();
					
	    			var innerWidth = listParent.width(); // Set widths
	    			itemsWidth = (innerWidth)/itemsVisible;
	    			childSet.width(itemsWidth);
	    			childSet.last().insertBefore(childSet.first());
	    			childSet.last().insertBefore(childSet.first());
	    			object.css({'left' : -itemsWidth}); 

	    			object.fadeIn();
					$(window).trigger("resize"); // needed to position arrows correctly

				},
				
				
				/******************************
				Append HTML
				*******************************/			
				
				appendHTML: function() {
					
	   			 	object.addClass("nbs-flexisel-ul");
	   			 	object.wrap("<div class='nbs-flexisel-container'><div class='nbs-flexisel-inner'></div></div>");
	   			 	object.find("li").addClass("nbs-flexisel-item");
	 
	   			 	if(settings.setMaxWidthAndHeight) {
		   			 	var baseWidth = $(".nbs-flexisel-item > img").width();
		   			 	var baseHeight = $(".nbs-flexisel-item > img").height();
		   			 	$(".nbs-flexisel-item > img").css("max-width", baseWidth);
		   			 	$(".nbs-flexisel-item > img").css("max-height", baseHeight);
	   			 	}
	 
	   			 	$("<div class='nbs-flexisel-nav-left'></div><div class='nbs-flexisel-nav-right'></div>").insertAfter(object);
	   			 	var cloneContent = object.children().clone();
	   			 	object.append(cloneContent);
				},
						
				
				/******************************
				Set Event Handlers
				*******************************/
				setEventHandlers: function() {
					
					var listParent = object.parent();
					var childSet = object.children();
					var leftArrow = listParent.find($(".nbs-flexisel-nav-left"));
					var rightArrow = listParent.find($(".nbs-flexisel-nav-right"));
					
					$(window).on("resize", function(event){
						
						methods.setResponsiveEvents();
						
						var innerWidth = $(listParent).width();
						var innerHeight = $(listParent).height(); 
						
						itemsWidth = (innerWidth)/itemsVisible;
						
						childSet.width(itemsWidth);
						object.css({'left' : -itemsWidth});
						
						var halfArrowHeight = (leftArrow.height())/2;
						var arrowMargin = (innerHeight/2) - halfArrowHeight;
						leftArrow.css("top", arrowMargin + "px");
						rightArrow.css("top", arrowMargin + "px");
						
					});					
					
					$(leftArrow).on("click", function (event) {
						methods.scrollLeft();
					});
					
					$(rightArrow).on("click", function (event) {
						methods.scrollRight();
					});
					
					if(settings.pauseOnHover == true) {
						$(".nbs-flexisel-item").on({
							mouseenter: function () {
								canNavigate = false;
							}, 
							mouseleave: function () {
								canNavigate = true;
							}
						 });
					}

					if(settings.autoPlay == true) {
						
						setInterval(function () {
							if(canNavigate == true)
								methods.scrollRight();
						}, settings.autoPlaySpeed);
					}
					
				},
				
				/******************************
				Set Responsive Events
				*******************************/			
				
				setResponsiveEvents: function() {
					var contentWidth = $('html').width();
					
					if(settings.enableResponsiveBreakpoints == true) {
						if(contentWidth < settings.responsiveBreakpoints.portrait.changePoint) {
							itemsVisible = settings.responsiveBreakpoints.portrait.visibleItems;
						}
						else if(contentWidth > settings.responsiveBreakpoints.portrait.changePoint && contentWidth < settings.responsiveBreakpoints.landscape.changePoint) {
							itemsVisible = settings.responsiveBreakpoints.landscape.visibleItems;
						}
						else if(contentWidth > settings.responsiveBreakpoints.landscape.changePoint && contentWidth < settings.responsiveBreakpoints.tablet.changePoint) {
							itemsVisible = settings.responsiveBreakpoints.tablet.visibleItems;
						}
						else {
							itemsVisible = settings.visibleItems;
						}
					}
				},			
				
				/******************************
				Scroll Left
				*******************************/				
				
				scrollLeft:function() {

					if(canNavigate == true) {
						canNavigate = false;
						
						var listParent = object.parent();
						var innerWidth = listParent.width();
						
						itemsWidth = (innerWidth)/itemsVisible;
						
						var childSet = object.children();
						
						object.animate({
								'left' : "+=" + itemsWidth
							},
							{
								queue:false, 
								duration:settings.animationSpeed,
								easing: "linear",
								complete: function() {  
									childSet.last().insertBefore(childSet.first()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)   								
									methods.adjustScroll();
									canNavigate = true; 
								}
							}
						);
					}
				},
				
				/******************************
				Scroll Right
				*******************************/				
				
				scrollRight:function() {
					
					if(canNavigate == true) {
						canNavigate = false;
						
						var listParent = object.parent();
						var innerWidth = listParent.width();
						
						itemsWidth = (innerWidth)/itemsVisible;
						
						var childSet = object.children();
						
						object.animate({
								'left' : "-=" + itemsWidth
							},
							{
								queue:false, 
								duration:settings.animationSpeed,
								easing: "linear",
								complete: function() {  
									childSet.first().insertAfter(childSet.last()); // Get the first list item and put it after the last list item (that's how the infinite effects is made)   
									methods.adjustScroll();
									canNavigate = true; 
								}
							}
						);
					}
				},
				
				/******************************
				Adjust Scroll 
				*******************************/
				
				adjustScroll: function() {
					
					var listParent = object.parent();
					var childSet = object.children();				
					
					var innerWidth = listParent.width(); 
					itemsWidth = (innerWidth)/itemsVisible;
					childSet.width(itemsWidth);
					object.css({'left' : -itemsWidth});		
				}			
	        
	        };
	        
	        if (methods[options]) { 	// $("#element").pluginName('methodName', 'arg1', 'arg2');
	            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
	        } else if (typeof options === 'object' || !options) { 	// $("#element").pluginName({ option: 1, option:2 });
	            return methods.init.apply(this);  
	        } else {
	            $.error( 'Method "' +  method + '" does not exist in flexisel plugin!');
	        }        
	};

	})(jQuery);


	/**
	 * @name		jQuery Countdown Plugin
	 * @author		Martin Angelov
	 * @version 	1.0
	 * @url			http://tutorialzine.com/2011/12/countdown-jquery/
	 * @license		MIT License
	 */

	(function($){
		
		// Number of seconds in every time division
		var days	= 24*60*60,
			hours	= 60*60,
			minutes	= 60;
		
		// Creating the plugin
		$.fn.countdown = function(prop){
			
			var options = $.extend({
				callback	: function(){},
				timestamp	: 0
			},prop);
			
			var left, d, h, m, s, positions;

			// Initialize the plugin
			init(this, options);
			
			positions = this.find('.position');
			
			(function tick(){
				
				// Time left
				left = Math.floor((options.timestamp - (new Date())) / 1000);
				
				if(left < 0){
					left = 0;
				}
				
				// Number of days left
				d = Math.floor(left / days);
				updateDuo(0, 1, d);
				left -= d*days;
				
				// Number of hours left
				h = Math.floor(left / hours);
				updateDuo(2, 3, h);
				left -= h*hours;
				
				// Number of minutes left
				m = Math.floor(left / minutes);
				updateDuo(4, 5, m);
				left -= m*minutes;
				
				// Number of seconds left
				s = left;
				updateDuo(6, 7, s);
				
				// Calling an optional user supplied callback
				options.callback(d, h, m, s);
				
				// Scheduling another call of this function in 1s
				setTimeout(tick, 1000);
			})();
			
			// This function updates two digit positions at once
			function updateDuo(minor,major,value){
				switchDigit(positions.eq(minor),Math.floor(value/10)%10);
				switchDigit(positions.eq(major),value%10);
			}
			
			return this;
		};


		function init(elem, options){
			elem.addClass('countdownHolder');

			// Creating the markup inside the container
			$.each(['Days','Hours','Minutes','Seconds'],function(i){
				var boxName;
				if(this=="Days") {
					boxName = "Days";
				}
				else if(this=="Hours") {
					boxName = "Hours";
				}
				else if(this=="Minutes") {
					boxName = "Minutes";
				}
				else {
					boxName = "Seconds";
				}
				$('<div class="count'+this+'">' +
					'<span class="position">' +
						'<span class="digit static">0</span>' +
					'</span>' +
					'<span class="position">' +
						'<span class="digit static">0</span>' +
					'</span>' +
					'<span class="boxName">' +
						'<span class="'+this+'">' + boxName + '</span>' +
					'</span>'
				).appendTo(elem);
				
				if(this!="Seconds"){
					elem.append('<span class="points">:</span><span class="countDiv countDiv'+i+'"></span>');
				}
			});

		}

		// Creates an animated transition between the two numbers
		function switchDigit(position,number){
			
			var digit = position.find('.digit')
			
			if(digit.is(':animated')){
				return false;
			}
			
			if(position.data('digit') == number){
				// We are already showing this number
				return false;
			}
			
			position.data('digit', number);
			
			var replacement = $('<span>',{
				'class':'digit',
				css:{
					top:0,
					opacity:0
				},
				html:number
			});
			
			// The .static class is added when the animation
			// completes. This makes it run smoother.
			
			digit
				.before(replacement)
				.removeClass('static')
				.animate({top:0,opacity:0},'fast',function(){
					digit.remove();
				})

			replacement
				.delay(100)
				.animate({top:0,opacity:1},'fast',function(){
					replacement.addClass('static');
				});
		}
	})(jQuery);

	/**
	 * ImageZoom Plugin
	 * http://0401morita.github.io/imagezoom-plugin
	 * MIT licensed
	 *
	 * Copyright (C) 2014 http://0401morita.github.io/imagezoom-plugin A project by Yosuke Morita
	 */
	(function($){
	  var defaults = {
	    cursorcolor:'255,255,255',
	    opacity:0.5,
	    cursor:'crosshair',
	    zindex:2147483647,
	    zoomviewsize:[480,395],
	    zoomviewposition:'right',
	    zoomviewmargin:10,
	    zoomviewborder:'none',
	    magnification:1.925
	  };

	  var imagezoomCursor,imagezoomView,settings,imageWidth,imageHeight,offset;
	  var methods = {
	    init : function(options){
	      $this = $(this),
	      imagezoomCursor = $('.imagezoom-cursor'),
	      imagezoomView = $('.imagezoom-view'),
	      $(document).on('mouseenter',$this.selector,function(e){
	        var data = $(this).data();
	        settings = $.extend({},defaults,options,data),
	        offset = $(this).offset(),
	        imageWidth = $(this).width(),
	        imageHeight = $(this).height(),
	        cursorSize = [(settings.zoomviewsize[0]/settings.magnification),(settings.zoomviewsize[1]/settings.magnification)];
	        if(data.imagezoom == true){
	          imageSrc = $(this).attr('src');
	        }else{
	          imageSrc = $(this).get(0).getAttribute('data-imagezoom');
	        }

	        var posX = e.pageX,posY = e.pageY,zoomViewPositionX;
	        $('body').prepend('<div class="imagezoom-cursor">&nbsp;</div><div class="imagezoom-view"><img src="'+imageSrc+'"></div>');

	        if(settings.zoomviewposition == 'right'){
	          zoomViewPositionX = (offset.left+imageWidth+settings.zoomviewmargin);
	        }else{
	          zoomViewPositionX = (offset.left-imageWidth-settings.zoomviewmargin);
	        }

	        $(imagezoomView.selector).css({
	          'position':'absolute',
	          'left': zoomViewPositionX,
	          'top': offset.top,
	          'width': cursorSize[0]*settings.magnification,
	          'height': cursorSize[1]*settings.magnification,
	          'background':'#000',
	          'z-index':2147483647,
	          'overflow':'hidden',
	          'border': settings.zoomviewborder
	        });

	        $(imagezoomView.selector).children('img').css({
	          'position':'absolute',
	          'width': imageWidth*settings.magnification,
	          'height': imageHeight*settings.magnification,
	        });

	        $(imagezoomCursor.selector).css({
	          'position':'absolute',
	          'width':cursorSize[0],
	          'height':cursorSize[1],
	          'background-color':'rgb('+settings.cursorcolor+')',
	          'z-index':settings.zindex,
	          'opacity':settings.opacity,
	          'cursor':settings.cursor
	        });
	        $(imagezoomCursor.selector).css({'top':posY-(cursorSize[1]/2),'left':posX});
	        $(document).on('mousemove',document.body,methods.cursorPos);
	      });
	    },
	    cursorPos:function(e){
	      var posX = e.pageX,posY = e.pageY;
	      if(posY < offset.top || posX < offset.left || posY > (offset.top+imageHeight) || posX > (offset.left+imageWidth)){
	        $(imagezoomCursor.selector).remove();
	        $(imagezoomView.selector).remove();
	        return;
	      }

	      if(posX-(cursorSize[0]/2) < offset.left){
	        posX = offset.left+(cursorSize[0]/2);
	      }else if(posX+(cursorSize[0]/2) > offset.left+imageWidth){
	        posX = (offset.left+imageWidth)-(cursorSize[0]/2);
	      }

	      if(posY-(cursorSize[1]/2) < offset.top){
	        posY = offset.top+(cursorSize[1]/2);
	      }else if(posY+(cursorSize[1]/2) > offset.top+imageHeight){
	        posY = (offset.top+imageHeight)-(cursorSize[1]/2);
	      }

	      $(imagezoomCursor.selector).css({'top':posY-(cursorSize[1]/2),'left':posX-(cursorSize[0]/2)});
	      $(imagezoomView.selector).children('img').css({'top':((offset.top-posY)+(cursorSize[1]/2))*settings.magnification,'left':((offset.left-posX)+(cursorSize[0]/2))*settings.magnification});

	      $(imagezoomCursor.selector).mouseleave(function(){
	        $(this).remove();
	      });
	    }
	  };

	  $.fn.imageZoom = function(method){
	    if(methods[method]){
	      return methods[method].apply( this, Array.prototype.slice.call(arguments,1));
	    }else if( typeof method === 'object' || ! method ) {
	      return methods.init.apply(this,arguments);
	    }else{
	      $.error(method);
	    }
	  }

	  $(document).ready(function(){
	    $('[data-imagezoom]').imageZoom();
	  });
	})(jQuery);


	// Easy Responsive Tabs Plugin
	// Author: Samson.Onna <Email : samson3d@gmail.com>
	(function ($) {
	    $.fn.extend({
	        easyResponsiveTabs: function (options) {
	            //Set the default values, use comma to separate the settings, example:
	            var defaults = {
	                type: 'default', //default, vertical, accordion;
	                width: 'auto',
	                fit: true
	            }
	            //Variables
	            var options = $.extend(defaults, options);            
	            var opt = options, jtype = opt.type, jfit = opt.fit, jwidth = opt.width, vtabs = 'vertical', accord = 'accordion';

	            //Main function
	            this.each(function () {
	                var $respTabs = $(this);
	                $respTabs.find('ul.resp-tabs-list li').addClass('resp-tab-item');
	                $respTabs.css({
	                    'display': 'block',
	                    'width': jwidth
	                });

	                $respTabs.find('.resp-tabs-container > div').addClass('resp-tab-content');
	                jtab_options();
	                //Properties Function
	                function jtab_options() {
	                    if (jtype == vtabs) {
	                        $respTabs.addClass('resp-vtabs');
	                    }
	                    if (jfit == true) {
	                        $respTabs.css({ width: '100%', margin: '0px' });
	                    }
	                    if (jtype == accord) {
	                        $respTabs.addClass('resp-easy-accordion');
	                        $respTabs.find('.resp-tabs-list').css('display', 'none');
	                    }
	                }

	                //Assigning the h2 markup
	                var $tabItemh2;
	                $respTabs.find('.resp-tab-content').before("<h2 class='resp-accordion' role='tab'><span class='resp-arrow'></span></h2>");

	                var itemCount = 0;
	                $respTabs.find('.resp-accordion').each(function () {
	                    $tabItemh2 = $(this);
	                    var innertext = $respTabs.find('.resp-tab-item:eq(' + itemCount + ')').text();
	                    $respTabs.find('.resp-accordion:eq(' + itemCount + ')').append(innertext);
	                    $tabItemh2.attr('aria-controls', 'tab_item-' + (itemCount));
	                    itemCount++;
	                });

	                //Assigning the 'aria-controls' to Tab items
	                var count = 0,
	                    $tabContent;
	                $respTabs.find('.resp-tab-item').each(function () {
	                    $tabItem = $(this);
	                    $tabItem.attr('aria-controls', 'tab_item-' + (count));
	                    $tabItem.attr('role', 'tab');

	                    //First active tab                   
	                    $respTabs.find('.resp-tab-item').first().addClass('resp-tab-active');
	                    $respTabs.find('.resp-accordion').first().addClass('resp-tab-active');
	                    $respTabs.find('.resp-tab-content').first().addClass('resp-tab-content-active').attr('style', 'display:block');

	                    //Assigning the 'aria-labelledby' attr to tab-content
	                    var tabcount = 0;
	                    $respTabs.find('.resp-tab-content').each(function () {
	                        $tabContent = $(this);
	                        $tabContent.attr('aria-labelledby', 'tab_item-' + (tabcount));
	                        tabcount++;
	                    });
	                    count++;
	                });

	                //Tab Click action function
	                $respTabs.find("[role=tab]").each(function () {
	                    var $currentTab = $(this);
	                    $currentTab.click(function () {

	                        var $tabAria = $currentTab.attr('aria-controls');

	                        if ($currentTab.hasClass('resp-accordion') && $currentTab.hasClass('resp-tab-active')) {
	                            $respTabs.find('.resp-tab-content-active').slideUp('', function () { $(this).addClass('resp-accordion-closed'); });
	                            $currentTab.removeClass('resp-tab-active');
	                            return false;
	                        }
	                        if (!$currentTab.hasClass('resp-tab-active') && $currentTab.hasClass('resp-accordion')) {
	                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
	                            $respTabs.find('.resp-tab-content-active').slideUp().removeClass('resp-tab-content-active resp-accordion-closed');
	                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');

	                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').slideDown().addClass('resp-tab-content-active');
	                        } else {
	                            $respTabs.find('.resp-tab-active').removeClass('resp-tab-active');
	                            $respTabs.find('.resp-tab-content-active').removeAttr('style').removeClass('resp-tab-content-active').removeClass('resp-accordion-closed');
	                            $respTabs.find("[aria-controls=" + $tabAria + "]").addClass('resp-tab-active');
	                            $respTabs.find('.resp-tab-content[aria-labelledby = ' + $tabAria + ']').addClass('resp-tab-content-active').attr('style', 'display:block');
	                        }
	                    });
	                    //Window resize function                   
	                    $(window).resize(function () {
	                        $respTabs.find('.resp-accordion-closed').removeAttr('style');
	                    });
	                });
	            });
	        }
	    });
	})(jQuery);
;
