/**
 * Default NSS parser - treats NSS as opaque string
 */

import type { INSSParser } from '../interfaces';
import type { ValidationResult } from '../../core/types';
import { validResult } from '../../core/validation';

/**
 * Default opaque NSS structure
 */
export type OpaqueNSS = {
  readonly value: string;
};

/**
 * Default NSS parser that treats NSS as opaque string
 * Used as fallback for unregistered NIDs
 */
export class DefaultNSSParser implements INSSParser<OpaqueNSS> {
  parse(nss: string): OpaqueNSS {
    return { value: nss };
  }

  format(components: OpaqueNSS): string {
    return components.value;
  }

  validate(_components: OpaqueNSS): ValidationResult {
    // Always valid - no structure to validate
    return validResult();
  }
}
