import { kParsedProtocol, kLegacyParsedProtocol } from '../constants';
import type { UnknownParsedRecord, ParsedUrnRecord, DeprecatedParsedProtocol, LiteralUnion } from '../typings';

type UnknownPropertyName<T extends ParsedUrnRecord | DeprecatedParsedProtocol<UnknownParsedRecord>> = LiteralUnion<Extract<keyof T, string>>;

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isObject(
  value: unknown
): value is Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? true : false;
}

export function getValue<T extends ParsedUrnRecord | DeprecatedParsedProtocol<UnknownParsedRecord>>(
  parsed: T,
  propertyName: UnknownPropertyName<T>
): null | string {
  const value = parsed[propertyName];
  return isString(value) ? value : null;
}

export function getStringValue<T extends ParsedUrnRecord | DeprecatedParsedProtocol<UnknownParsedRecord>>(
  parsed: T,
  propertyName: UnknownPropertyName<T>
): string {
  return getValue(parsed, propertyName) ?? '';
}

export function isValid<T extends ParsedUrnRecord | DeprecatedParsedProtocol<UnknownParsedRecord>>(
  parsed: T,
  propertyName: UnknownPropertyName<T>,
  allowZeroLength: boolean = false
): boolean {
  const value = getValue(parsed, propertyName);
  return isString(value) && (allowZeroLength || value.length > 0);
}

export function getProtocol(
  parsed: ParsedUrnRecord | DeprecatedParsedProtocol<UnknownParsedRecord>
): null | string {
  const value = parsed[kParsedProtocol] ?? parsed[kLegacyParsedProtocol] ?? null;
  return isString(value) ? value : null;
}

export function isProtocol(
  expectedProtocol: string,
  parsed: UnknownParsedRecord
): boolean {
  const value = getProtocol(parsed);
  if (!isString(value)) return false;
  return expectedProtocol.toLowerCase() === value.toLowerCase();
}
