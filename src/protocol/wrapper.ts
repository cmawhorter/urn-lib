/**
 * URN Wrapper - Protocol-aware URN handling
 */

import type { IURN, IParser } from '../core/interfaces';
import type { ParserOptions } from '../core/types';
import type { IProtocolHandler } from './types';
import type { NSSRegistry } from '../nss/registry';

/**
 * URN Wrapper result with parsed URN and NSS components
 */
export type URNFullResult<T extends IURN> = {
  readonly urn: T;
  readonly nss?: unknown;
};

/**
 * Protocol-aware URN wrapper
 * Handles protocol stripping/adding and optional NSS parsing
 */
export class URNWrapper<T extends IURN> {
  constructor(
    private readonly parser: IParser<T>,
    private readonly protocolHandler: IProtocolHandler,
    private readonly registry?: NSSRegistry
  ) {}

  /**
   * Parse URN string with protocol
   */
  parse(rawURN: string, options?: ParserOptions): T {
    const stripped = this.protocolHandler.stripProtocol(rawURN);
    return this.parser.parse(stripped, options);
  }

  /**
   * Parse URN with NSS decomposition
   */
  parseFull(rawURN: string, options?: ParserOptions): URNFullResult<T> {
    const urn = this.parse(rawURN, options);

    const nss = this.registry
      ? this.registry.parseFull(urn.nid.value, urn.nss.encoded, options)
      : undefined;

    return { urn, nss };
  }

  /**
   * Format URN with protocol
   */
  format(urn: T): string {
    const formatted = this.parser.format(urn);
    return this.protocolHandler.addProtocol(formatted);
  }

  /**
   * Get the protocol handler
   */
  getProtocolHandler(): IProtocolHandler {
    return this.protocolHandler;
  }

  /**
   * Get the parser
   */
  getParser(): IParser<T> {
    return this.parser;
  }

  /**
   * Get the NSS registry (if any)
   */
  getRegistry(): NSSRegistry | undefined {
    return this.registry;
  }
}
