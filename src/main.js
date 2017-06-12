import format from './lib/format.js';
import tokenize from './lib/tokenize.js';
import { urnObject, isRfc2141NidString } from './lib/validate.js';
import { PREFIX as RFC2141_PREFIX, SEPARATOR as RFC2141_SEPARATOR, COMPONENTS as RFC2141_COMPONENTS } from './schemes/rfc2141.js';

// generates an array of rules that treats all but the last component
// as an nid string (with limited valid charset)
export function generateDefaultValidationRules(components) {
  let lastIndex = components.length - 1;
  let nss = components[lastIndex];
  let rules = [];
  for (let i=0; i < lastIndex; i++) {
    let name = components[i];
    rules.push([ name, 'invalid characters', (value) => isRfc2141NidString(value, false) ]);
  }
  return rules;
}

function build(protocol, components, data) {
  data = data || {};
  let built = { protocol };
  components.forEach(name => built[name] = data[name] || null);
  return built;
}

export function create(protocol, options) {
  options = options || {};
  let components        = options.components || RFC2141_COMPONENTS;
  let allowEmpty        = options.hasOwnProperty('allowEmpty') ? options.allowEmpty : false;
  let separator         = options.separator || RFC2141_SEPARATOR;
  let validationRules   = options.validationRules || generateDefaultValidationRules(components);
  return {
    validate:   urnObject.bind(null, protocol, validationRules, allowEmpty),
    format:     format.bind(null, protocol, components, separator),
    parse:      tokenize.bind(null, components, separator),
    build:      build.bind(null, protocol, components),
  };
}

export const RFC2141 = create(RFC2141_PREFIX, {
  components:       RFC2141_COMPONENTS,
  separator:        RFC2141_SEPARATOR,
  allowEmpty:       false,
});
