/**
 * Core type definitions for URN library
 * Provides branded types for compile-time safety
 */

// Branded types for compile-time safety
export type URNString = string & { __brand: 'URN' };
export type NID = string & { __brand: 'NID' };
export type NSS = string & { __brand: 'NSS' };

/**
 * NID (Namespace Identifier) value
 */
export type NIDValue = {
  readonly value: string;
};

/**
 * NSS (Namespace Specific String) value
 * Maintains both encoded and optionally decoded forms
 */
export type NSSValue = {
  readonly encoded: string;    // Original percent-encoded form
  readonly decoded?: string;   // Lazy-decoded form (optional)
};

/**
 * RQF (Resolution, Query, Fragment) components from RFC 8141
 */
export type RQFComponents = {
  readonly resolution?: string;  // ?+ component (r-component)
  readonly query?: string;       // ?= component (q-component)
  readonly fragment?: string;    // # component (f-component)
};

/**
 * Validation error detail
 */
export type ValidationError = {
  readonly code: string;           // Error code like 'INVALID_NID', 'INVALID_ENCODING'
  readonly message: string;        // Human-readable error message
  readonly field?: string;         // Which component failed
  readonly position?: number;      // Character position if applicable
};

/**
 * Result of validation operation
 */
export type ValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly errors: readonly ValidationError[] };

/**
 * Parser configuration options
 */
export type ParserOptions = {
  readonly strict?: boolean;                 // Default: true - throw on invalid input
  readonly maxLength?: number;               // Default: 8192 - maximum URN length
  readonly allowInvalidEncoding?: boolean;   // Default: false - requires valid % encoding
  readonly allowControlChars?: boolean;      // Default: false - rejects control characters
};

/**
 * Default parser options
 */
export const DEFAULT_PARSER_OPTIONS: Required<ParserOptions> = {
  strict: true,
  maxLength: 8192,
  allowInvalidEncoding: false,
  allowControlChars: false,
};
