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
 */
export const create = createUrnUtil;

