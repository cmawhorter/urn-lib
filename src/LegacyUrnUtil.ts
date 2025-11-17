import type { ILegacyUrnUtil } from './ILegacyUrnUtil';
import type { UrnUtilOptions } from './UrnUtil';
import { formatUrn, buildUrnLegacy } from './lib/format';
import { parseUrnLegacy } from './lib/parse';
import { urnObject, validationRuleObjectToArray } from './lib/validate';
import type {
  FormattedUrn,
  ParsedUrnRecord,
  UnknownParsedRecord,
  UrnComponentNames,
  ValidationRule,
  DeprecatedParsedProtocol,
} from './typings';

export class LegacyUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string> implements ILegacyUrnUtil<TProt, TComp, TSep> {
  public get separator(): TSep {
    return this._separator;
  }
  private _separator: TSep;

  public get protocol(): TProt {
    return this._protocol;
  }
  private _protocol: TProt;

  public get components(): TComp {
    return this._components;
  }
  private _components: TComp;

  public get validationRules(): Array<ValidationRule> {
    return this._validationRules;
  }
  private _validationRules: Array<ValidationRule>;

  public get allowEmpty(): boolean {
    return this._allowEmpty;
  }
  private _allowEmpty: boolean;

  constructor({
    protocol,
    components,
    separator,
    validationRules = [],
    allowEmpty = false,
  }: UrnUtilOptions<TProt, TComp, TSep>) {
    this._separator = separator;
    this._protocol = protocol;
    this._components = components;
    this._validationRules = validationRules.map(rule => validationRuleObjectToArray(rule));
    this._allowEmpty = allowEmpty;
  }

  validate(parsed: DeprecatedParsedProtocol<UnknownParsedRecord | ParsedUrnRecord<TComp>>): string[] | null {
    const {protocol, validationRules, allowEmpty} = this;
    return urnObject(protocol, validationRules, allowEmpty, parsed);
  }

  format(parsed: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): FormattedUrn<TProt, TSep> {
    const {protocol, components, separator} = this;
    return formatUrn(protocol, components, separator, parsed) as FormattedUrn<TProt, TSep>;
  }

  parse(value: unknown): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>> | null {
    const {components, separator} = this;
    return parseUrnLegacy(components, separator, value);
  }

  build(data?: DeprecatedParsedProtocol<Partial<ParsedUrnRecord<TComp>>>): DeprecatedParsedProtocol<ParsedUrnRecord<TComp>> {
    const {protocol, components} = this;
    return buildUrnLegacy(protocol, components, data);
  }
}
