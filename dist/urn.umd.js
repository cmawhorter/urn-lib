(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.urn = global.urn || {})));
}(this, (function (exports) { 'use strict';

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var RFC2141_NID_VALID = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

function isRfc2141NidString(str, strictMode) {
  if (true === strictMode) {
    if (!isString(str)) return false;
    // https://www.ietf.org/rfc/rfc2141.txt Section 2.1
    if (str.length < 1) {
      return false;
    }
    if (str.length > 31) {
      return false;
    }
    // To avoid confusion with the "urn:" identifier, the NID "urn" is
    // reserved and MUST NOT be used.
    if ('urn' === str.toLowerCase()) {
      return false;
    }
  }
  if (null === str) str = '';else if (!isString(str)) return false;
  if (str[0] === '-') return false;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = str[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var chr = _step.value;

      if (RFC2141_NID_VALID.indexOf(chr) < 0) {
        return false;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
}

function isString(str) {
  return typeof str === 'string';
}

function isProtocol(protocol, parsed) {
  var value = parsed.protocol;
  if (!isString(value)) return false;
  return protocol.toLowerCase() === value.toLowerCase();
}

function isValid(parsed, propertyName, allowZeroLength) {
  var value = parsed[propertyName];
  return parsed.hasOwnProperty(propertyName) && isString(value) && (allowZeroLength || value.length > 0);
}

function urnObject(protocol, customRules, allowZeroLength, parsed) {
  var errors = [];
  Object.keys(parsed).forEach(function (propertyName, index) {
    if (!isValid(parsed, propertyName, allowZeroLength)) {
      errors.push('validation failed for ' + propertyName + ': invalid value');
    }
  });
  if (!isProtocol(protocol, parsed)) {
    errors.push('validation failed for protocol: expected ' + protocol + ' but got ' + parsed.protocol);
  }
  customRules.forEach(function (rule) {
    var _rule = slicedToArray(rule, 3),
        propertyName = _rule[0],
        errorMessage = _rule[1],
        validator = _rule[2];

    try {
      var value = parsed[propertyName];
      if (true !== validator(value)) {
        errors.push('validation failed for ' + propertyName + ': ' + errorMessage);
      }
    } catch (err) {
      errors.push('validation error for ' + propertyName + ': ' + err.message);
    }
  });
  return errors.length ? errors : null;
}

var format = function (components, separator, parsed) {
  if (!parsed.hasOwnProperty('protocol') || !isString(parsed.protocol)) throw new Error('protocol is missing or invalid');
  return parsed.protocol + separator + components.map(function (name) {
    return !isString(parsed[name]) ? '' : parsed[name];
  }).join(separator);
};

var tokenize = function (components, separator, str) {
  if (!Array.isArray(components) || components.length < 1) throw new Error('components not valid');
  if (!isString(str)) return null;
  var parts = str.split(separator);
  if (parts.length < 2) return null;
  var protocol = parts.shift(); // all schemes have a protocol
  var parsed = { protocol: protocol };
  var len = components.length - 1; // last component treated differently
  for (var i = 0; i < len; i++) {
    var name = components[i];
    parsed[name] = parts.length ? parts.shift() : null;
  }
  // concat last component.  anything beyond what's defined in components
  // is a single string that belongs to last part
  var lastPartName = components[len];
  parsed[lastPartName] = parts.length ? parts.join(separator) : null;
  return parsed;
};

var PREFIX = 'urn';
var SEPARATOR = ':';

var COMPONENTS = ['nid', 'nss'];

// generates an array of rules that treats all but the last component
// as an nid string (with limited valid charset)
function generateDefaultValidationRules(components) {
  var lastIndex = components.length - 1;
  var nss = components[lastIndex];
  var rules = [];
  for (var i = 0; i < lastIndex; i++) {
    var name = components[i];
    rules.push([name, 'invalid characters', function (value) {
      return isRfc2141NidString(value, false);
    }]);
  }
  return rules;
}

function build(protocol, components, data) {
  data = data || {};
  var built = { protocol: protocol };
  components.forEach(function (name) {
    return built[name] = data[name] || null;
  });
  return built;
}

function create(protocol, options) {
  options = options || {};
  var components = options.components || COMPONENTS;
  var allowEmpty = options.hasOwnProperty('allowEmpty') ? options.allowEmpty : false;
  var separator = options.separator || SEPARATOR;
  var validationRules = options.validationRules || generateDefaultValidationRules(components);
  return {
    validate: urnObject.bind(null, protocol, validationRules, allowEmpty),
    format: format.bind(null, components, separator),
    parse: tokenize.bind(null, components, separator),
    build: build.bind(null, protocol, components)
  };
}

var RFC2141 = create(PREFIX, {
  components: COMPONENTS,
  separator: SEPARATOR,
  allowEmpty: false
});

exports.generateDefaultValidationRules = generateDefaultValidationRules;
exports.create = create;
exports.RFC2141 = RFC2141;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=urn.umd.js.map
