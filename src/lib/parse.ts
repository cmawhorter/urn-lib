import { kLegacyParsedProtocol, kParsedProtocol } from '../constants';
import { DeprecatedParsedProtocol, ParsedUrnRecord, UrnComponentNames } from '../typings';
import { isString } from './common';

export function parseUrnLegacy<T extends UrnComponentNames> (
  components: T,
  separator: string,
  value: unknown
): null | DeprecatedParsedProtocol<ParsedUrnRecord<T>> {
  const parsed = parseUrn(components, separator, value);
  if (!parsed) return null;
  const entries = [...Object.entries(parsed)];
  entries.unshift([kLegacyParsedProtocol, parsed[kParsedProtocol]]);
  return Object.fromEntries(entries) as DeprecatedParsedProtocol<ParsedUrnRecord<T>>;
}

export function parseUrn<T extends UrnComponentNames> (
  components: T,
  separator: string,
  value: unknown
): null | ParsedUrnRecord<T> {
  if (!Array.isArray(components) || components.length < 1) throw new Error('components not valid');
  if (!isString(value)) return null;
  const parts = value.split(separator);
  if (parts.length < 2) return null;
  const protocol = parts.shift()!; // all schemes have a protocol
  const entries: Array<[string | typeof kParsedProtocol, null | string]> = [
    [kParsedProtocol, protocol],
  ];
  const len = components.length - 1; // last component treated differently
  for (let i=0; i < len; i++) {
    const name = components[i];
    entries.push([name, parts.length ? parts.shift()! : null]);
  }
  // concat last component.  anything beyond what's defined in components
  // is a single string that belongs to last part
  const lastPartName = components[len];
  entries.push([lastPartName, parts.length ? parts.join(separator) : null]);
  return Object.fromEntries(entries) as ParsedUrnRecord<T>;
}
