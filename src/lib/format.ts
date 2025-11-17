import { kLegacyParsedProtocol, kParsedProtocol } from '../constants';
import { UrnComponentNames, ParsedUrnRecord, DeprecatedParsedProtocol, FormattedUrn } from '../typings';
import { isString, getProtocol, getStringValue, getValue } from './common';

export function formatUrn<T extends UrnComponentNames>(
  rawProtocol: null | string,
  components: T,
  separator: string,
  parsed: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<T>>>
): string {
  const protocol = getProtocol(parsed) ?? rawProtocol ?? null;
  if (!isString(protocol)) {
    throw new Error('protocol is missing or invalid');
  }
  let formatted = '';
  for (const name of components) {
    formatted += separator + getStringValue(parsed, name);
  }
  // render as "${proto}:" in the event components is empty for some reason
  return protocol + (formatted || separator);
}

export function formatUrnStrict<
  TProt extends string,
  TComp extends UrnComponentNames,
  TSep extends string
>(
  protocol: TProt,
  components: TComp,
  separator: TSep,
  parsed: Partial<ParsedUrnRecord<TComp>>
): FormattedUrn<TProt, TSep> {
  const parsedProto = getProtocol(parsed);
  if (protocol !== parsedProto) {
    throw new Error(`protocol mismatch; "${protocol}" was passed but parse is "${parsedProto ?? '[missing]'}"`);
  }
  return formatUrn(protocol, components, separator, parsed) as FormattedUrn<TProt, TSep>;
}

export function buildUrnLegacy<T extends UrnComponentNames>(
  protocol: string,
  components: T,
  data: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<T>>> = {}
): ParsedUrnRecord<T> & {protocol: string} {
  // NOTE: for more complete backwards compat, we have to reimplement this function separately to ensure key order matches (tests expect this)
  const entries: Array<[T[number] | typeof kParsedProtocol, null | string]> = [
    [kParsedProtocol, protocol],
    [kLegacyParsedProtocol, protocol],
  ];
  for (const name of components) {
    entries.push([name, getValue(data, name)]);
  }
  return Object.fromEntries(entries) as ParsedUrnRecord<T> & {protocol: string};
}

export function buildUrn<T extends UrnComponentNames>(
  protocol: string,
  components: T,
  data: Partial<ParsedUrnRecord<T>> = {}
): ParsedUrnRecord<T> {
  const entries: Array<[T[number] | typeof kParsedProtocol, null | string]> = [
    [kParsedProtocol, protocol],
  ];
  for (const name of components) {
    entries.push([name, getValue(data, name)]);
  }
  return Object.fromEntries(entries) as ParsedUrnRecord<T>;
}
