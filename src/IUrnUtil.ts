import type {
  UrnComponentNames,
  ParsedUrnRecord,
  ValidationRule,
  UnknownParsedRecord,
  DeprecatedParsedProtocol,
  FormattedUrn,
} from './typings';

export interface IUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string> {
  readonly separator: TSep;
  readonly protocol: TProt;
  readonly components: TComp;
  readonly validationRules: Array<ValidationRule>;
  readonly allowEmpty: boolean;

  validate(parsed: UnknownParsedRecord | ParsedUrnRecord<TComp>): string[] | null;

  format(parsed: Partial<ParsedUrnRecord<TComp>>): FormattedUrn<TProt, TSep>;

  parse(value: unknown): ParsedUrnRecord<TComp>;

  build(data?: Partial<ParsedUrnRecord<TComp>>): ParsedUrnRecord<TComp>;
}

export type DeprecatedProtoUrnUtil<
  TProt extends string,
  TComp extends UrnComponentNames,
  TSep extends string,
  T extends IUrnUtil<TProt, TComp, TSep>
> = Omit<T, 'validate' | 'format' | 'parse' | 'build'> & {
  validate(parsed: DeprecatedParsedProtocol<UnknownParsedRecord | ParsedUrnRecord<TComp>>): string[] | null;

  format(parsed: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): FormattedUrn<TProt, TSep>;

  parse(value: unknown): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>> | null;

  build(data?: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>>;
};
