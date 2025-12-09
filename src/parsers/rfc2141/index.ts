/**
 * RFC 2141 URN parser
 * Public API for RFC 2141 URN parsing, formatting, and validation
 */

import type { IParser } from '../../core/interfaces';
import type { RFC2141URN } from './types';
import type { ValidationResult, ParserOptions } from '../../core/types';
import { parseRFC2141 } from './parse';
import { formatRFC2141 } from './format';
import { validateRFC2141 } from './validate';

// Re-export types and utilities
export type { RFC2141URN } from './types';
export { createRFC2141URN, checkRFC2141Equivalence } from './types';
export { parseRFC2141 } from './parse';
export { formatRFC2141 } from './format';
export { validateRFC2141 } from './validate';
export { checkEquivalence } from './equivalence';

/**
 * RFC 2141 Parser class
 * Thin wrapper around functional implementation
 */
export class RFC2141Parser implements IParser<RFC2141URN> {
  constructor(private readonly options?: ParserOptions) {}

  parse(input: string, opts?: ParserOptions): RFC2141URN {
    return parseRFC2141(input, opts ?? this.options);
  }

  format(urn: RFC2141URN): string {
    return formatRFC2141(urn);
  }

  validate(urn: RFC2141URN): ValidationResult {
    return validateRFC2141(urn, this.options);
  }
}

/**
 * Factory function to create RFC 2141 parser
 */
export function createRFC2141Parser(options?: ParserOptions): RFC2141Parser {
  return new RFC2141Parser(options);
}
