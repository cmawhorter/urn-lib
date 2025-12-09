/**
 * RFC 8141 URN parser
 * Public API for RFC 8141 URN parsing, formatting, and validation
 */

import type { IParser } from '../../core/interfaces';
import type { RFC8141URN } from './types';
import type { ValidationResult, ParserOptions } from '../../core/types';
import { parseRFC8141 } from './parse';
import { formatRFC8141 } from './format';
import { validateRFC8141 } from './validate';

// Re-export types and utilities
export type { RFC8141URN } from './types';
export { createRFC8141URN, checkRFC8141Equivalence } from './types';
export { parseRFC8141 } from './parse';
export { formatRFC8141 } from './format';
export { validateRFC8141 } from './validate';
export { checkEquivalence } from './equivalence';
export { extractRQF, formatRQF } from './rqf';

/**
 * RFC 8141 Parser class
 * Thin wrapper around functional implementation
 */
export class RFC8141Parser implements IParser<RFC8141URN> {
  constructor(private readonly options?: ParserOptions) {}

  parse(input: string, opts?: ParserOptions): RFC8141URN {
    return parseRFC8141(input, opts ?? this.options);
  }

  format(urn: RFC8141URN): string {
    return formatRFC8141(urn);
  }

  validate(urn: RFC8141URN): ValidationResult {
    return validateRFC8141(urn, this.options);
  }
}

/**
 * Factory function to create RFC 8141 parser
 */
export function createRFC8141Parser(options?: ParserOptions): RFC8141Parser {
  return new RFC8141Parser(options);
}
