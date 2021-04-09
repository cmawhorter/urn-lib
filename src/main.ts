import { formatUrn } from './lib/format';
import { parseUrn } from './lib/parse';
import { urnObject, isRfc2141NidString, isString, validationRuleObjectToArray } from './lib/validate';
import { PREFIX as RFC2141_PREFIX, SEPARATOR as RFC2141_SEPARATOR, COMPONENTS as RFC2141_COMPONENTS } from './schemes/rfc2141';
import { Item, ValidationRule, ValidationRuleObject } from './typings';

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

function build(
  protocol: string,
  components: string[],
  data: Item<string, unknown> = {}
): Item<string, null | string> {
  data = data || {};
  const result: Item<string, null | string> = { protocol };
  components
    .forEach(name => {
      const value = data[name];
      result[name] = isString(value) ? value : null;
    });
  return result;
}

export type UrnLibOptions = Partial<{
  components: string[];
  allowEmpty: boolean;
  separator: string;
  validationRules: (ValidationRule | ValidationRuleObject)[];
}>;

export function create(
  protocol: string,
  options?: UrnLibOptions
) {
  options = options || {};
  const components = options.components || RFC2141_COMPONENTS;
  const allowEmpty = options.allowEmpty ?? false;
  const separator = options.separator ?? RFC2141_SEPARATOR;
  const rawValidationRules = options.validationRules || generateDefaultValidationRules(components);
  const validationRules = rawValidationRules
    .map(rule =>
      validationRuleObjectToArray(rule));
  return {
    validate:   urnObject.bind(null, protocol, validationRules, allowEmpty),
    format:     formatUrn.bind(null, protocol, components, separator),
    parse:      parseUrn.bind(null, components, separator),
    build:      build.bind(null, protocol, components),
  };
}

export const RFC2141 = create(RFC2141_PREFIX, {
  components:       RFC2141_COMPONENTS,
  separator:        RFC2141_SEPARATOR,
  allowEmpty:       false,
});
