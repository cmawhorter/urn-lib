import type { Item, ValidationRule, ValidationRuleObject } from '../typings';

export const RFC2141_NID_VALID = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

// generates an array of rules that treats all but the last component
// as an nid string (with limited valid charset)
export function generateDefaultValidationRules(components: string[]): ValidationRule[] {
  const lastIndex = components.length - 1;
  const rules: ValidationRule[] = [];
  for (let i=0; i < lastIndex; i++) {
    const name = components[i];
    rules.push([ name, 'invalid characters', (value: unknown) => isRfc2141NidString(value, false) ]);
  }
  return rules;
}

export function validationRuleObjectToArray(rule: ValidationRuleObject | ValidationRule): ValidationRule {
  if (Array.isArray(rule)) {
    return rule;
  }
  return [rule.name, rule.failureMessage, rule.test];
}

export function isRfc2141NidString(
  str: unknown,
  strictMode: boolean = false
) {
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
  str = str ?? '';
  if (!isString(str)) return false;
  if (str[0] === '-') return false;
  for (const chr of str) {
    if (RFC2141_NID_VALID.indexOf(chr) < 0) {
      return false;
    }
  }
  return true;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isProtocol(
  protocol: string,
  parsed: Item<string, unknown>
): boolean {
  const value = parsed.protocol;
  if (!isString(value)) return false;
  return protocol.toLowerCase() === value.toLowerCase();
}

export function isValid(
  parsed: Item<string, unknown>,
  propertyName: string,
  allowZeroLength: boolean = false
): boolean {
  const value = parsed[propertyName];
  return isString(value) && (allowZeroLength || value.length > 0);
}

export function urnObject(
  protocol: string,
  customRules: ValidationRule[],
  allowZeroLength: boolean,
  parsed: Item<string, unknown>
): null | string[] {
  const errors: string[] = [];
  Object.keys(parsed)
    .forEach(propertyName => {
      if (!isValid(parsed, propertyName, allowZeroLength)) {
        errors.push(`validation failed for ${propertyName}: invalid value`);
      }
    });
  if (!isProtocol(protocol, parsed)) {
    errors.push(`validation failed for protocol: expected ${protocol} but got ${parsed.protocol}`);
  }
  customRules
    .forEach(rule => {
      const [propertyName, failureMessage, test] = rule;
      try {
        const value = parsed[propertyName];
        if (true !== test(value)) {
          errors.push(`validation failed for ${propertyName}: ${failureMessage}`);
        }
      }
      catch(err: unknown) {
        const errMessage = err instanceof Error ? err.message : 'unknown error';
        errors.push(`validation error for ${propertyName}: ${errMessage}`);
      }
    });
  return errors.length ? errors : null;
}
