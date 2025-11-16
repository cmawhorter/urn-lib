import { formatUrn, formatUrnStrict, buildUrnLegacy as buildUrn, buildUrn as buildUrnStrict } from './lib/format';
import { parseUrnLegacy as parseUrn, parseUrn as parseUrnStrict } from './lib/parse';

export {
  formatUrn,
  buildUrn,
  parseUrn,
  formatUrnStrict,
  buildUrnStrict,
  parseUrnStrict,
};

export { generateDefaultValidationRules, urnObject } from './lib/validate';
export type { ValidationRule, ValidationRuleObject } from './typings';
export { RFC2141 } from './rfc2141';
export { kParsedProtocol } from './constants';

import { createUrnUtil } from './util';
export { createUrnUtil };

/**
 * @deprecated
 * @alias createUrnUtil
 */
export const create = createUrnUtil;

export type { IUrnUtil } from './IUrnUtil';
export { UrnUtil } from './UrnUtil';
