import type {
  UrnComponentNames,
  ParsedUrnRecord,
  ValidationRule,
  UnknownParsedRecord,
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
