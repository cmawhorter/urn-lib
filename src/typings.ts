import { kLegacyParsedProtocol, kParsedProtocol } from './constants';

export type LiteralUnion<T extends U, U = string> = T | (U & { zz_IGNORE_ME?: never });

export type UrnComponentNames = ReadonlyArray<string>;

export interface IParsedUrn {
  [kParsedProtocol]: string;
};

export type ParsedUrnRecord<T extends UrnComponentNames> = Record<T[number], null | string> & IParsedUrn;

export type UnknownParsedRecord = (object | Record<string, unknown>) & Partial<IParsedUrn>;

export type DeprecatedParsedProtocol<T> = T & {
  /**
   * @deprecated
   * Prior to v3.0, the protocol could alternatively be passed as a
   * key named "protocol". This is deprecated and support for this
   * is being removed.
   */
  [kLegacyParsedProtocol]?: null | string;
};

export type ValidationRule = [string, string, (value: unknown) => boolean];

export type ValidationRuleObject = {
  name: string;
  failureMessage: string;
  test: (value: unknown) => boolean;
};

export type FormattedUrn<
  TProt extends string,
  TSep extends string
> = `${TProt}${TSep}${string}`;
