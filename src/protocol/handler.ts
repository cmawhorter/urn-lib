/**
 * Default protocol handler implementations
 */

import type { IProtocolHandler } from './types';

/**
 * Default URN protocol handler
 * Handles 'urn:' protocol prefix
 */
export class URNProtocolHandler implements IProtocolHandler {
  readonly protocol = 'urn';

  stripProtocol(input: string): string {
    const lower = input.slice(0, 4).toLowerCase();
    if (lower === 'urn:') {
      return input.slice(4);
    }
    // If no protocol, assume it's already stripped
    return input;
  }

  addProtocol(formatted: string): string {
    // Don't add if already present
    const lower = formatted.slice(0, 4).toLowerCase();
    if (lower === 'urn:') {
      return formatted;
    }
    return `urn:${formatted}`;
  }

  detectProtocol(input: string): string | undefined {
    const match = input.match(/^([a-z][a-z0-9+.-]*?):/i);
    return match ? match[1].toLowerCase() : undefined;
  }
}

/**
 * Generic protocol handler
 * Can handle any protocol prefix
 */
export class GenericProtocolHandler implements IProtocolHandler {
  constructor(public readonly protocol: string) {}

  stripProtocol(input: string): string {
    const prefix = `${this.protocol}:`;
    const lower = input.slice(0, prefix.length).toLowerCase();
    if (lower === prefix) {
      return input.slice(prefix.length);
    }
    return input;
  }

  addProtocol(formatted: string): string {
    const prefix = `${this.protocol}:`;
    const lower = formatted.slice(0, prefix.length).toLowerCase();
    if (lower === prefix) {
      return formatted;
    }
    return `${prefix}${formatted}`;
  }

  detectProtocol(input: string): string | undefined {
    const match = input.match(/^([a-z][a-z0-9+.-]*?):/i);
    return match ? match[1].toLowerCase() : undefined;
  }
}

/**
 * Factory function to create URN protocol handler
 */
export function createURNProtocolHandler(): IProtocolHandler {
  return new URNProtocolHandler();
}

/**
 * Factory function to create generic protocol handler
 */
export function createProtocolHandler(protocol: string): IProtocolHandler {
  return new GenericProtocolHandler(protocol);
}
