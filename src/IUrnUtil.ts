import { UrnComponentNames, ParsedUrnRecord, ValidationRule, UnknownParsedRecord, DeprecatedParsedProtocol } from './typings';

export interface IUrnUtil<TProt extends string, TComp extends UrnComponentNames> {
  readonly separator: string;
  readonly protocol: TProt;
  readonly components: TComp;
  readonly validationRules: Array<ValidationRule>;
  readonly allowEmpty: boolean;

  validate(parsed: UnknownParsedRecord | ParsedUrnRecord<TComp>): string[] | null;
  format(parsed: Partial<ParsedUrnRecord<TComp>>): string;
  parse(value: unknown): ParsedUrnRecord<TComp> | null;
  build(data?: Partial<ParsedUrnRecord<TComp>>): ParsedUrnRecord<TComp>;
}

export type DeprecatedProtoUrnUtil<TProt extends string, TComp extends UrnComponentNames, T extends IUrnUtil<TProt, TComp>> = Omit<T, 'validate' | 'format' | 'parse' | 'build'> & {
  validate(parsed: DeprecatedParsedProtocol<UnknownParsedRecord | ParsedUrnRecord<TComp>>): string[] | null;
  format(parsed: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): string;
  parse(value: unknown): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>> | null;
  build(data?: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>>;
};
