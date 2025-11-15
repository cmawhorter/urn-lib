import { Item } from '../typings';
import { isString } from './validate';

export function formatUrn(
  rawProtocol: null | string,
  components: string[],
  separator: string,
  parsed: Item<string, null | string>,
  {
    strictProtocol = false,
  }: {
    /**
     * Default false. If true, protocol MUST be passed and MUST match parsed protocol
     */
    strictProtocol?: boolean;
  } = {}
): string {
  const parsedProto = parsed && parsed.protocol ? parsed.protocol : null;
  const protocol = parsedProto ?? rawProtocol;
  if (!isString(protocol)) {
    throw new Error('protocol is missing or invalid');
  }
  if (strictProtocol && rawProtocol !== parsedProto) {
    throw new Error(`protocol mismatch; "${protocol ?? '[missing]'}" was passed but parse is "${parsedProto ?? '[missing]'}"`);
  }
  return protocol + separator + components.map(name => !isString(parsed[name]) ? '' : parsed[name]).join(separator);
}

export function buildUrn(
  protocol: string,
  components: string[],
  data: Item<string, unknown> = {}
): Item<string, null | string> {
  data = data || {};
  const result: Item<string, null | string> = { protocol };
  components
    .forEach(name => {
      const value = data[name];
      result[name] = isString(value) ? value : null;
    });
  return result;
}
