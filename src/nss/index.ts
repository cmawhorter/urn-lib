/**
 * NSS Parser System
 * Public API for namespace-specific string parsing
 */

export { NSSRegistry } from './registry';
export type { INSSParser } from './interfaces';

// Export parsers
export { DefaultNSSParser, type OpaqueNSS } from './parsers/default';
export { HierarchicalParser, type HierarchicalNSS, type HierarchicalParserOptions } from './parsers/hierarchical';
export { AWSARNParser, type AWSARNComponents, type AWSResourceComponent } from './parsers/aws-arn';
