export { formatUrn, buildUrn } from './lib/format';
export { parseUrn } from './lib/parse';
export { generateDefaultValidationRules, urnObject } from './lib/validate';
export type { ValidationRule, ValidationRuleObject } from './typings';
export { RFC2141 } from './rfc2141';

import { createUrnUtil } from './util';
export { createUrnUtil };

/**
 * @deprecated
 * @alias createUrnUtil
 * This is v2 legacy code from this lib that will only be available via '@cmawhorter/urn/legacy' in v4 of this lib
 */
export const create = createUrnUtil;

