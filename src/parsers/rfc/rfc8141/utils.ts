import { URNError } from '../../../errors/URNError';
import { ERR_INVALID_URN } from '../constants';

const rfcSeparator = ':';

export type ParsedRfc8141Urn = {
  nid: string;
  nss: string;
  rComponent: string;
  qComponent: string;
  fComponent: string;
};

export function parseRfc8141Urn(input: string): ParsedRfc8141Urn {
  let remaining = input;
  let fComponent = '';
  const fragmentIndex = remaining.indexOf('#');
  if (fragmentIndex > -1) {
    fComponent = remaining.slice(fragmentIndex + 1);
    remaining = remaining.slice(0, fragmentIndex);
  }
  let qComponent = '';
  const qIndex = remaining.indexOf('?=');
  if (qIndex > -1) {
    qComponent = remaining.slice(qIndex + 2);
    remaining = remaining.slice(0, qIndex);
  }
  let rComponent = '';
  const rIndex = remaining.indexOf('?+');
  if (rIndex > -1) {
    rComponent = remaining.slice(rIndex + 2);
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
  let result = parsed.nid.toLowerCase() + rfcSeparator + parsed.nss;
  if (parsed.rComponent) {
    result += `?+${parsed.rComponent}`;
  }
  if (parsed.qComponent) {
    result += `?=${parsed.qComponent}`;
  }
  if (parsed.fComponent) {
    result += `#${parsed.fComponent}`;
  }
  return result;
}
