import type { IParser } from '../../core/IParser';

export type ParsedRfcUrn = {
  readonly nid: string;
  readonly nss: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IRfcParser<T extends ParsedRfcUrn> extends IParser<T> {}
