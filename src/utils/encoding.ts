
/**
 * Check if a string has valid percent-encoding format
 * Validates that % is always followed by exactly 2 hex characters
 */
export function validPercentEncoding(str: string): boolean {
  const percentPattern = /%([0-9A-Fa-f]{2})/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = percentPattern.exec(str)) !== null) {
    // Check if there's a % between last match and this one
    const between = str.slice(lastIndex, match.index);
    if (between.indexOf('%') > -1) {
      return false; // Found % not followed by valid hex
    }
    lastIndex = match.index + match[0].length;
  }
  // Check remaining string for invalid %
  const remaining = str.slice(lastIndex);
  if (remaining.indexOf('%') > -1) {
    return false;
  }
  return true;
}

/**
 * Check if string contains encoded null bytes or control characters
 * Control characters in the range %00-%1F or %7F-%9F
 */
export function hasEncodedControlChars(str: string): boolean {
  // Check for %00 (null byte) and %01-%1F (control chars)
  return /%0[0-9A-F]|%1[0-9A-F]|%7F|%[89][0-9A-F]/i.test(str);
}

/**
 * Normalize percent-encoding for comparison
 * Converts hex characters to uppercase as per RFC 3986
 */
export function normalizePercentEncoding(str: string): string {
  return str.replace(/%[0-9A-Fa-f]{2}/g, m => m.toUpperCase());
}
