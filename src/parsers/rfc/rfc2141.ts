import type { IRfcParser, ParsedRfcUrn } from './IRfcParser';

// TODO: Implement an IRfcParser for RFC 2141

export type ParsedRfc2141Urn = ParsedRfcUrn;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRfc2141Parser extends IRfcParser<ParsedRfc2141Urn> {}
