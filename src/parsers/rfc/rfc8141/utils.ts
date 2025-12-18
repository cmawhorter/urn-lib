import { URNError } from '../../../errors/URNError';
import { ERR_INVALID_URN } from '../constants';
import type { ParsedRfcUrn } from '../types';
import { fComponentPrefix, qComponentPrefix, rComponentPrefix } from './constants';

const rfcSeparator = ':';

export type ParsedRfc8141Urn = ParsedRfcUrn & {
  rComponent: string;
  qComponent: string;
  fComponent: string;
};

export function parseRfc8141Urn(input: string): ParsedRfc8141Urn {
  let remaining = input;
  let fComponent = '';
  const fragmentIndex = remaining.indexOf(fComponentPrefix);
  if (fragmentIndex > -1) {
    fComponent = remaining.slice(fragmentIndex);
    remaining = remaining.slice(0, fragmentIndex);
  }
  let qComponent = '';
  const qIndex = remaining.indexOf(qComponentPrefix);
  if (qIndex > -1) {
    qComponent = remaining.slice(qIndex);
    remaining = remaining.slice(0, qIndex);
  }
  let rComponent = '';
  const rIndex = remaining.indexOf(rComponentPrefix);
  if (rIndex > -1) {
    rComponent = remaining.slice(rIndex);
    remaining = remaining.slice(0, rIndex);
  }
  const colonIndex = remaining.indexOf(rfcSeparator);
  if (colonIndex === -1) {
    throw new URNError(
      'Invalid URN format: missing colon separator between NID and NSS',
      'MISSING_SEPARATOR'
    );
  }
  const nid = remaining.slice(0, colonIndex);
  const nss = remaining.slice(colonIndex + 1);
  if (nid.length < 2) {
    throw new URNError(
      `Invalid NID: must be at least 2 characters, got ${nid.length}`,
      ERR_INVALID_URN
    );
  }
  if (nid.length > 32) {
    throw new URNError(
      `Invalid NID: must not exceed 32 characters, got ${nid.length}`,
      ERR_INVALID_URN
    );
  }
  if (!/^[a-zA-Z0-9][-a-zA-Z0-9]*$/.test(nid)) {
    throw new URNError(
      'Invalid NID: must contain only alphanumeric characters and hyphens, and start with alphanumeric',
      ERR_INVALID_URN
    );
  }
  if (!nss) {
    throw new URNError(
      'Invalid URN: NSS cannot be empty',
      ERR_INVALID_URN
    );
  }
  return {
    nid: nid.toLowerCase(),
    nss,
    fComponent,
    qComponent,
    rComponent,
  };
}

export function formatRfc8141Urn(parsed: ParsedRfc8141Urn): string {
  return parsed.nid.toLowerCase()
    + rfcSeparator
    + parsed.nss
    + parsed.rComponent
    + parsed.qComponent
    + parsed.fComponent;
}
