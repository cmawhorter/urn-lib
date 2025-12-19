import { URNError } from '../../../errors/URNError';
import { ERR_INVALID_URN } from '../constants';

const rfcSeparator = ':';

export type ParsedRfc2141Urn = {
  nid: string;
  nss: string;
};

export function parseRfc2141Urn(input: string): ParsedRfc2141Urn {
  const colonIndex = input.indexOf(rfcSeparator);
  if (colonIndex < 0) {
    throw new URNError(
      'Invalid URN format: missing colon separator between NID and NSS',
      ERR_INVALID_URN
    );
  }
  const nid = input.slice(0, colonIndex);
  const nss = input.slice(colonIndex + 1);
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
  if (!/^[a-z0-9][-a-z0-9]*$/i.test(nid)) {
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
  };
}

export function formatRfc2141Urn(parsed: ParsedRfc2141Urn): string {
  return parsed.nid.toLowerCase() + rfcSeparator + parsed.nss;
}
