import { formatUrn, buildUrn } from './lib/format';
import { parseUrn } from './lib/parse';
import { generateDefaultValidationRules, urnObject, validationRuleObjectToArray } from './lib/validate';
import { SEPARATOR as RFC2141_SEPARATOR, COMPONENTS as RFC2141_COMPONENTS } from './schemes/rfc2141';
import { ValidationRule, ValidationRuleObject } from './typings';

export type UrnLibOptions = Partial<{
  components: string[];
  separator: string;
  allowEmpty: boolean;
  validationRules: (ValidationRule | ValidationRuleObject)[];
}>;

/**
 * @deprecated
 * This is v2 legacy code from this lib that will only be available via '@cmawhorter/urn/legacy' in v4 of this lib
 */
export function createUrnUtil(
  protocol: string,
  options: UrnLibOptions = {}
) {
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
    build:      buildUrn.bind(null, protocol, components),
  };
}
