import { kLegacyParsedProtocol } from '../constants';
import { PREFIX } from '../schemes/rfc2141';
import type { DeprecatedParsedProtocol, FormattedUrn, ParsedUrnRecord, UnknownParsedRecord, UrnComponentNames, ValidationRule, ValidationRuleObject } from '../typings';
import { getProtocol, getValue, isProtocol, isString, isObject, isValid } from './common';

export const RFC2141_NID_VALID = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-'.split(''));

// generates an array of rules that treats all but the last component
// as an nid string (with limited valid charset)
export function generateDefaultValidationRules(components: UrnComponentNames): ValidationRule[] {
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
    if (PREFIX === str.toLowerCase()) {
      return false;
    }
  }
  str = str ?? '';
  if (!isString(str)) return false;
  if (str[0] === '-') return false;
  for (const chr of str) {
    if (!RFC2141_NID_VALID.has(chr)) {
      return false;
    }
  }
  return true;
}

export function urnObject<T extends UrnComponentNames>(
  protocol: string,
  customRules: ValidationRule[],
  allowZeroLength: boolean,
  parsed: ParsedUrnRecord<T> | DeprecatedParsedProtocol<UnknownParsedRecord>,
  components?: T
): null | string[] {
  const allNames = new Set<T[number] | typeof kLegacyParsedProtocol>([...Object.keys(parsed), ...(components ?? [])]);
  const errors: string[] = [];
  for (const propertyName of allNames) {
    if (!isValid(parsed, propertyName, allowZeroLength)) {
      errors.push(`validation failed for ${propertyName}: invalid value`);
    }
  }
  if (!isProtocol(protocol, parsed)) {
    errors.push(`validation failed for protocol: expected "${protocol}" but got "${getProtocol(parsed) ?? '[missing]'}"`);
  }
  for (const rule of customRules) {
    const [propertyName, failureMessage, test] = rule;
    try {
      const value = getValue(parsed, propertyName);
      if (true !== test(value)) {
        errors.push(`validation failed for ${propertyName}: ${failureMessage}`);
      }
    }
    catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'unknown error';
      errors.push(`validation error for ${propertyName}: ${errMsg}`);
    }
  }
  return errors.length ? errors : null;
}

export function validUrn<
  TProt extends string,
  TSep extends string
>(
  protocol: TProt,
  separator: TSep,
  value: unknown
): value is FormattedUrn<TProt, TSep> {
  if (!isString(value)) return false;
  return value.startsWith(`${protocol}${separator}`) ? true : false;
}

export function validParsedUrn<
  TProt extends string,
  TComp extends UrnComponentNames
>(
  {
    protocol,
    components,
    allowZeroLength = false,
    customRules = [],
  }: {
    protocol: TProt;
    components: TComp;
    customRules?: ValidationRule[];
    allowZeroLength?: boolean;
  },
  value: unknown
): value is ParsedUrnRecord<TComp> {
  if (!isObject(value)) return false;
  const errors = urnObject(
    protocol,
    customRules,
    allowZeroLength,
    value,
    components
  );
  return errors === null;
}
