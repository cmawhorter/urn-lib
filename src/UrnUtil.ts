import type { IUrnUtil } from './IUrnUtil';
import { formatUrn, formatUrnStrict, buildUrn, buildUrnLegacy } from './lib/format';
import { parseUrn, parseUrnLegacy } from './lib/parse';
import { urnObject, validationRuleObjectToArray } from './lib/validate';
import type {
  FormattedUrn,
  ParsedUrnRecord,
  UnknownParsedRecord,
  UrnComponentNames,
  ValidationRule,
  ValidationRuleObject,
} from './typings';

export type UrnUtilOptions<TProt extends string, TComp extends UrnComponentNames, TSep extends string> = {
  protocol: TProt;
  components: TComp;
  separator: TSep;
  allowEmpty?: boolean;
  validationRules?: Array<ValidationRule | ValidationRuleObject>;
  /**
   * Default: false
   *
   * Prior to v4.x the protocol could alternatively be passed inline
   * with the parsed object. Support for this is being removed and
   * being migrated to a symbol.
   */
  enableDeprecatedProtocol?: boolean;
};

export class UrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string> implements IUrnUtil<TProt, TComp, TSep> {
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

  private enableDeprecatedProtocol: boolean;

  constructor({
    protocol,
    components,
    separator,
    validationRules = [],
    allowEmpty = false,
    enableDeprecatedProtocol = false,
  }: UrnUtilOptions<TProt, TComp, TSep>) {
    this._separator = separator;
    this._protocol = protocol;
    this._components = components;
    this._validationRules = validationRules.map(rule => validationRuleObjectToArray(rule));
    this._allowEmpty = allowEmpty;
    this.enableDeprecatedProtocol = enableDeprecatedProtocol;
  }

  validate(parsed: UnknownParsedRecord | ParsedUrnRecord<TComp>): string[] | null {
    const {protocol, validationRules, allowEmpty} = this;
    return urnObject(protocol, validationRules, allowEmpty, parsed);
  }

  format(parsed: Partial<ParsedUrnRecord<TComp>>): FormattedUrn<TProt, TSep> {
    const {enableDeprecatedProtocol, protocol, components, separator} = this;
    return enableDeprecatedProtocol
      ? formatUrn(protocol, components, separator, parsed) as FormattedUrn<TProt, TSep>
      : formatUrnStrict(protocol, components, separator, parsed);
  }

  parse(value: unknown): ParsedUrnRecord<TComp> {
    const {components, separator, enableDeprecatedProtocol} = this;
    const result =
      enableDeprecatedProtocol
        ? parseUrnLegacy(components, separator, value)
        : parseUrn(components, separator, value);
    if (result === null) {
      throw new Error('parsing urn failed');
    }
    return result;
  }

  build(data?: Partial<ParsedUrnRecord<TComp>>): ParsedUrnRecord<TComp> {
    const {enableDeprecatedProtocol, protocol, components} = this;
    return enableDeprecatedProtocol
      ? buildUrnLegacy(protocol, components, data)
      : buildUrn(protocol, components, data);
  }
}
