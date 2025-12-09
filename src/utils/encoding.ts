/**
 * Percent-encoding utilities for URN handling
 * Implements RFC 3986 percent-encoding with UTF-8 support
 */

import { URNSecurityError } from '../core/validation';

/**
 * RFC 2141 unreserved characters (allowed unencoded in NSS)
 * alphanumeric + ( ) + , - . : = @ ; $ _ ! * '
 */
const RFC2141_UNRESERVED = new Set([
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  '(', ')', '+', ',', '-', '.', ':', '=', '@', ';', '$', '_', '!', '*', "'"
]);

/**
 * RFC 8141 additional unreserved characters
 * Adds: / ~ &
 */
const RFC8141_UNRESERVED = new Set([
  ...RFC2141_UNRESERVED,
  '/', '~', '&'
]);

/**
 * Percent-encode a string using UTF-8 encoding
 * @param str String to encode
 * @param safeChars Set of characters that don't need encoding
 * @returns Percent-encoded string
 */
export function percentEncode(str: string, safeChars: Set<string> = RFC2141_UNRESERVED): string {
  let result = '';

  for (const char of str) {
    if (safeChars.has(char)) {
      result += char;
    }
    else {
      // Encode to UTF-8 bytes
      const encoded = encodeURIComponent(char);
      result += encoded;
    }
  }

  return result;
}

/**
 * Decode a percent-encoded string
 * @param str Percent-encoded string
 * @param allowInvalid If true, pass through invalid sequences instead of throwing
 * @returns Decoded string
 * @throws URNSecurityError if encoding is invalid and allowInvalid is false
 */
export function percentDecode(str: string, allowInvalid: boolean = false): string {
  // Validate percent-encoding format
  if (!allowInvalid && !isValidPercentEncoding(str)) {
    throw new URNSecurityError(
      'Invalid percent-encoding format',
      'INVALID_ENCODING'
    );
  }

  try {
    return decodeURIComponent(str);
  } catch {
    if (allowInvalid) {
      return str; // Return as-is if invalid
    }
    throw new URNSecurityError(
      'Failed to decode percent-encoded string',
      'INVALID_ENCODING'
    );
  }
}

/**
 * Check if a string has valid percent-encoding format
 * Validates that % is always followed by exactly 2 hex digits
 */
export function isValidPercentEncoding(str: string): boolean {
  const percentPattern = /%([0-9A-Fa-f]{2})/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = percentPattern.exec(str)) !== null) {
    // Check if there's a % between last match and this one
    const between = str.slice(lastIndex, match.index);
    if (between.includes('%')) {
      return false; // Found % not followed by valid hex
    }
    lastIndex = match.index + match[0].length;
  }

  // Check remaining string for invalid %
  const remaining = str.slice(lastIndex);
  if (remaining.includes('%')) {
    return false;
  }

  return true;
}

/**
 * Check if string contains encoded null bytes or control characters
 */
export function hasEncodedControlChars(str: string): boolean {
  // Check for %00 (null byte) and %01-%1F (control chars)
  return /%0[0-9A-Fa-f]|%1[0-9A-Fa-f]/i.test(str);
}

/**
 * Normalize percent-encoding for comparison
 * Converts hex digits to uppercase as per RFC 3986
 */
export function normalizePercentEncoding(str: string): string {
  return str.replace(/%[0-9A-Fa-f]{2}/g, match => match.toUpperCase());
}

/**
 * Get RFC 8141 safe character set
 */
export function getRFC8141SafeChars(): Set<string> {
  return RFC8141_UNRESERVED;
}

/**
 * Get RFC 2141 safe character set
 */
export function getRFC2141SafeChars(): Set<string> {
  return RFC2141_UNRESERVED;
}
