import type { UrnComponentNames, ValidationRule, DeprecatedParsedProtocol, UnknownParsedRecord, ParsedUrnRecord, FormattedUrn } from './typings';


export interface ILegacyUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string> {
  readonly separator: TSep;
  readonly protocol: TProt;
  readonly components: TComp;
  readonly validationRules: Array<ValidationRule>;
  readonly allowEmpty: boolean;

  validate(parsed: DeprecatedParsedProtocol<UnknownParsedRecord | ParsedUrnRecord<TComp>>): string[] | null;

  format(parsed: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): FormattedUrn<TProt, TSep>;

  parse(value: unknown): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>> | null;

  build(data?: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>>;
}
