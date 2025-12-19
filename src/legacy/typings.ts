export type Item<K extends string, V> = Record<K, undefined | V>;

/**
 * @deprecated
 * This is v2 legacy code from this lib that will only be available via 'urn-lib/legacy' in v4 of this lib
 */
export type ValidationRule = [string, string, (value: unknown) => boolean];

/**
 * @deprecated
 * This is v2 legacy code from this lib that will only be available via 'urn-lib/legacy' in v4 of this lib
 */
export type ValidationRuleObject = {
  name: string;
  failureMessage: string;
  test: (value: unknown) => boolean;
};
