import { URNError } from './URNError';

/**
 * Custom error class for security-related errors
 */
export class URNSecurityError extends URNError {
  constructor(message: string, code: string = 'SECURITY_ERROR', field?: string) {
    super(message, code, field);
    this.name = 'URNSecurityError';
  }
}
