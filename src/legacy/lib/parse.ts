import { Item } from '../typings';
import { isString } from './validate';

/**
 * @deprecated
 * This is v2 legacy code from this lib that will only be available via '@cmawhorter/urn/legacy' in v4 of this lib
 */
export function parseUrn(
  components: string[],
  separator: string,
  value: unknown
): null | Item<string, null | string> {
  if (!Array.isArray(components) || components.length < 1) throw new Error('components not valid');
  if (!isString(value)) return null;
  const parts = value.split(separator);
  if (parts.length < 2) return null;
  const protocol = parts.shift(); // all schemes have a protocol
  const parsed: Item<string, null | string> = { protocol };
  const len = components.length - 1; // last component treated differently
  for (let i=0; i < len; i++) {
    const name = components[i];
    parsed[name] = parts.length ? parts.shift() : null;
  }
  // concat last component.  anything beyond what's defined in components
  // is a single string that belongs to last part
  const lastPartName = components[len];
  parsed[lastPartName]  = parts.length ? parts.join(separator) : null;
  return parsed;
}
