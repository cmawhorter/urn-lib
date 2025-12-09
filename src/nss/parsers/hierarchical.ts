/**
 * Generic hierarchical NSS parser
 * For colon or slash-separated namespace specific strings
 */

import type { INSSParser } from '../interfaces';
import type { ValidationResult, ParserOptions } from '../../core/types';
import { validResult } from '../../core/validation';

/**
 * Hierarchical NSS structure
 */
export type HierarchicalNSS = {
  readonly parts: readonly string[];
  readonly separator: string;
};

/**
 * Hierarchical NSS parser options
 */
export type HierarchicalParserOptions = {
  readonly separator: string;     // Default: ':'
  readonly minParts?: number;     // Minimum number of parts
  readonly maxParts?: number;     // Maximum number of parts
};

/**
 * Generic hierarchical NSS parser
 * Splits NSS by separator into parts
 */
export class HierarchicalParser implements INSSParser<HierarchicalNSS> {
  constructor(private readonly options: HierarchicalParserOptions = { separator: ':' }) {}

  parse(nss: string, _opts?: ParserOptions): HierarchicalNSS {
    const parts = nss.split(this.options.separator);

    return {
      parts,
      separator: this.options.separator
    };
  }

  format(components: HierarchicalNSS): string {
    return components.parts.join(components.separator);
  }

  validate(components: HierarchicalNSS): ValidationResult {
    // Validate part count if specified
    if (this.options.minParts !== undefined && components.parts.length < this.options.minParts) {
      return {
        valid: false,
        errors: [{
          code: 'TOO_FEW_PARTS',
          message: `Expected at least ${this.options.minParts} parts, got ${components.parts.length}`
        }]
      };
    }

    if (this.options.maxParts !== undefined && components.parts.length > this.options.maxParts) {
      return {
        valid: false,
        errors: [{
          code: 'TOO_MANY_PARTS',
          message: `Expected at most ${this.options.maxParts} parts, got ${components.parts.length}`
        }]
      };
    }

    return validResult();
  }
}
