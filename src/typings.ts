export type Item<K extends string, V> = Record<K, undefined | V>;

export type ValidationRule = [string, string, (value: unknown) => boolean];

export type ValidationRuleObject = {
  name: string;
  failureMessage: string;
  test: (value: unknown) => boolean;
};
