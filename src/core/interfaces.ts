/**
 * Core interfaces for URN parsing and handling
 */

import type { NIDValue, NSSValue, RQFComponents, ValidationResult, ParserOptions } from './types';

// Re-export for convenience
export type { NIDValue, NSSValue, RQFComponents } from './types';

/**
 * Base URN structure (RFC 2141)
 */
export interface IURN {
  readonly nid: NIDValue;
  readonly nss: NSSValue;
  equals(other: IURN): boolean;
}

/**
 * Extended URN with RQF components (RFC 8141)
 */
export interface IURN8141 extends IURN {
  readonly rqf?: RQFComponents;
}

/**
 * Generic parser interface
 */
export interface IParser<T extends IURN> {
  parse(input: string, options?: ParserOptions): T;
  format(urn: T): string;
  validate(urn: T): ValidationResult;
}

/**
 * NSS (Namespace Specific String) parser interface
 * For namespace-specific decomposition of NSS content
 */
export interface INSSParser<T = unknown> {
  readonly supportedNID?: string;
  parse(nss: string, options?: ParserOptions): T;
  format(components: T): string;
  validate(components: T): ValidationResult;
}
