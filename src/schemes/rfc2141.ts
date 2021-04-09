import { ParsedUrn } from '../typings';

export const PREFIX = 'urn';
export const SEPARATOR = ':';

export interface IParsedRfc2141Components {
  nid: string;
  nss: string;
}

export type ParsedRfc2141 = ParsedUrn<typeof PREFIX, IParsedRfc2141Components>;

export const COMPONENTS: (keyof IParsedRfc2141Components)[] = [
  'nid',
  'nss',
];
