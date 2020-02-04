export const RFC2141_NID_VALID = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

export function isRfc2141NidString(str, strictMode) {
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
  if (null === str) str = '';
  else if (!isString(str)) return false;
  if (str[0] === '-') return false;
  for (let chr of str) {
    if (RFC2141_NID_VALID.indexOf(chr) < 0) {
      return false;
    }
  }
  return true;
}

export function isString(str) {
  return typeof str === 'string';
}

export function isProtocol(protocol, parsed) {
  let value = parsed.protocol;
  if (!isString(value)) return false;
  return protocol.toLowerCase() === value.toLowerCase();
}

export function isValid(parsed, propertyName, allowZeroLength) {
  let value = parsed[propertyName];
  return propertyName in parsed && isString(value) && (allowZeroLength || value.length > 0);
}

export function urnObject(protocol, customRules, allowZeroLength, parsed) {
  let errors    = [];
  Object.keys(parsed).forEach((propertyName, index) => {
    if (!isValid(parsed, propertyName, allowZeroLength)) {
      errors.push(`validation failed for ${propertyName}: invalid value`);
    }
  });
  if (!isProtocol(protocol, parsed)) {
    errors.push(`validation failed for protocol: expected ${protocol} but got ${parsed.protocol}`);
  }
  customRules.forEach(rule => {
    let [propertyName,errorMessage,validator] = rule;
    try {
      let value = parsed[propertyName];
      if (true !== validator(value)) {
        errors.push(`validation failed for ${propertyName}: ${errorMessage}`);
      }
    }
    catch(err) {
      errors.push(`validation error for ${propertyName}: ${err.message}`);
    }
  });
  return errors.length ? errors : null;
}
