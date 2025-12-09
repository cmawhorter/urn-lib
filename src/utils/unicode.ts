/**
 * UTF-8 and Unicode handling utilities
 * Provides safe string operations for URN processing
 */

/**
 * Normalize string using Unicode NFC normalization
 * Used for equivalence comparison
 * @param str String to normalize
 * @returns Normalized string
 */
export function normalizeForComparison(str: string): string {
  return str.normalize('NFC');
}

/**
 * Check if a string contains any control characters
 * Control characters are U+0000 to U+001F and U+007F to U+009F
 */
export function hasControlCharacters(str: string): boolean {
  for (const char of str) {
    const code = char.charCodeAt(0);
    if ((code >= 0x00 && code <= 0x1F) || (code >= 0x7F && code <= 0x9F)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a string contains null bytes
 */
export function hasNullBytes(str: string): boolean {
  return str.includes('\0');
}

/**
 * Case-insensitive ASCII comparison
 */
export function equalsIgnoreCase(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}
