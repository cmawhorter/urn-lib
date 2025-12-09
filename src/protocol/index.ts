/**
 * Protocol handling layer
 * Public API for protocol-aware URN parsing
 */

import type { IURN } from '../core/interfaces';
import type { ParserOptions } from '../core/types';
import type { RFC2141URN } from '../parsers/rfc2141';
import type { RFC8141URN } from '../parsers/rfc8141';
import { createRFC2141Parser } from '../parsers/rfc2141';
import { createRFC8141Parser } from '../parsers/rfc8141';
import type { NSSRegistry } from '../nss/registry';
import { URNWrapper } from './wrapper';
import { createURNProtocolHandler } from './handler';

export type { IProtocolHandler } from './types';
export { URNProtocolHandler, GenericProtocolHandler, createURNProtocolHandler, createProtocolHandler } from './handler';
export { URNWrapper, type URNFullResult } from './wrapper';

/**
 * Create RFC 2141 wrapper with protocol handling
 */
export function createRFC2141Wrapper(
  options?: ParserOptions,
  protocolHandler = createURNProtocolHandler()
): URNWrapper<RFC2141URN> {
  return new URNWrapper(
    createRFC2141Parser(options),
    protocolHandler
  );
}

/**
 * Create RFC 8141 wrapper with protocol handling
 */
export function createRFC8141Wrapper(
  options?: ParserOptions,
  protocolHandler = createURNProtocolHandler()
): URNWrapper<RFC8141URN> {
  return new URNWrapper(
    createRFC8141Parser(options),
    protocolHandler
  );
}

/**
 * Create full wrapper with NSS registry
 */
export function createFullWrapper(
  registry: NSSRegistry,
  rfcVersion: '2141' | '8141' = '8141',
  options?: ParserOptions,
  protocolHandler = createURNProtocolHandler()
): URNWrapper<IURN> {
  const parser = rfcVersion === '2141'
    ? createRFC2141Parser(options)
    : createRFC8141Parser(options);

  return new URNWrapper(parser, protocolHandler, registry);
}
