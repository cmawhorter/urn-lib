/**
 * NSS Parser Registry
 * Maps NIDs to their specific NSS parsers
 */

import type { INSSParser } from './interfaces';
import type { ParserOptions } from '../core/types';
import { DefaultNSSParser } from './parsers/default';

/**
 * Registry for NSS parsers
 * Maps NIDs to their specific parsing implementations
 */
export class NSSRegistry {
  private parsers = new Map<string, INSSParser>();

  constructor(
    private readonly fallbackParser: INSSParser = new DefaultNSSParser()
  ) {}

  /**
   * Register an NSS parser for a specific NID
   */
  register(nid: string, parser: INSSParser): void {
    this.parsers.set(nid.toLowerCase(), parser);
  }

  /**
   * Unregister an NSS parser for a specific NID
   */
  unregister(nid: string): boolean {
    return this.parsers.delete(nid.toLowerCase());
  }

  /**
   * Get parser for a specific NID
   * Returns fallback parser if NID not registered
   */
  getParser(nid: string): INSSParser {
    return this.parsers.get(nid.toLowerCase()) ?? this.fallbackParser;
  }

  /**
   * Check if a parser is registered for a NID
   */
  hasParser(nid: string): boolean {
    return this.parsers.has(nid.toLowerCase());
  }

  /**
   * Parse NSS using registered parser for the NID
   */
  parseFull(nid: string, nss: string, options?: ParserOptions): unknown {
    const parser = this.getParser(nid);
    return parser.parse(nss, options);
  }

  /**
   * Format NSS components back to string using registered parser
   */
  formatNSS(nid: string, components: unknown): string {
    const parser = this.getParser(nid);
    return parser.format(components);
  }

  /**
   * Get list of registered NIDs
   */
  getRegisteredNIDs(): string[] {
    return Array.from(this.parsers.keys());
  }

  /**
   * Clear all registered parsers
   */
  clear(): void {
    this.parsers.clear();
  }
}
