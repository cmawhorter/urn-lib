import type { IRfcParser, ParsedRfcUrn } from './IRfcParser';

// TODO: Implement an IParser for RFC 8141

export type ParsedRfc8141Urn = ParsedRfcUrn & {
  readonly rComponent: string;
  readonly qComponent: string;
  readonly fComponent: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRfc8141Parser extends IRfcParser<ParsedRfc8141Urn> {}
