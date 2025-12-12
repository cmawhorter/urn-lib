
// export type {
//   ValidationResult,
//   ValidationError,
// } from './core/types';

// // =============================================================================
// // RFC 2141 - Basic URN Parsing
// // =============================================================================

// export { parseRFC2141 } from './parsers/rfc/urn/rfc2141/parse';
// export { formatRFC2141 } from './parsers/rfc/urn/rfc2141/format';
// export { validateRFC2141 } from './parsers/rfc/urn/rfc2141/validate';
// export { urnEquals } from './parsers/rfc/urn/rfc2141/utils';

// // =============================================================================
// // RFC 8141 - Extended URN with RQF Components
// // =============================================================================

// export { parseRFC8141 } from './parsers/rfc/urn/rfc8141/parse';
// export { formatRFC8141 } from './parsers/rfc/urn/rfc8141/format';

// // =============================================================================
// // NSS Parsers - Namespace-Specific Parsing
// // =============================================================================

// export type { OpaqueNSS } from './rfc_nss_parsers/opaque/opaque';
// export { opaqueNSSParser } from './rfc_nss_parsers/opaque/opaque';

// export type { AWSARNComponents, AWSResourceComponent } from './rfc_nss_parsers/aws_arn/aws_arn';
// export { awsARNParser } from './rfc_nss_parsers/aws_arn/aws_arn';

// // NSS Registry
// export type { NSSRegistryConfig } from './rfc_nss_parsers/NSSRegistry';
// export {
//   createNSSRegistry,
//   getParser,
//   parseNSS,
// } from './rfc_nss_parsers/NSSRegistry';

// // =============================================================================
// // Protocol Handling
// // =============================================================================

// export { stripProtocol, addProtocol } from './protocol/protocol';
// export {
//   parseWithProtocol,
//   parseWithNSS,
//   formatWithProtocol
// } from './protocol/wrapper';

// // =============================================================================
// // Legacy v2 API (deprecated)
// // =============================================================================

/**
 * @deprecated
 * Legacy v2 code that will be removed in v4 here and only exist via `urn-lib/legacy`
 */
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
