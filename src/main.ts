export type { IUrn } from './core/IUrn';

export { URNError } from './errors/URNError';

export { AwsArn } from './parsers/aws_arn/AwsArn';
export { formatAwsArn, parseAwsArn } from './parsers/aws_arn/utils';

export { Rfc2141Urn } from './parsers/rfc/rfc2141/Rfc2141Urn';
export { formatRfc2141Urn, parseRfc2141Urn } from './parsers/rfc/rfc2141/utils';

export { Rfc8141Urn } from './parsers/rfc/rfc8141/Rfc8141Urn';
export { formatRfc8141Urn, parseRfc8141Urn } from './parsers/rfc/rfc8141/utils';

export { formatProtocol, parseProtocol } from './utils/protocol';

export {
  formatUrn,
  buildUrn,
  parseUrn,
  generateDefaultValidationRules,
  urnObject,
  RFC2141,
  createUrnUtil,
  create,
  type ValidationRule,
  type ValidationRuleObject,
} from './legacy/';
