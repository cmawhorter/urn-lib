/**
 * Protocol handler types and interfaces
 */

/**
 * Protocol handler interface
 * Handles adding/removing protocol prefixes from URN strings
 */
export interface IProtocolHandler {
  readonly protocol: string;  // e.g., 'urn', 'arn'
  stripProtocol(input: string): string;
  addProtocol(formatted: string): string;
  detectProtocol(input: string): string | undefined;
}
