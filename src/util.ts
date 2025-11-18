import { UrnUtil, type UrnUtilOptions } from './UrnUtil';
import { LegacyUrnUtil } from './LegacyUrnUtil';
import { generateDefaultValidationRules } from './lib/validate';
import { SEPARATOR as RFC2141_SEPARATOR, COMPONENTS as RFC2141_COMPONENTS } from './schemes/rfc2141';
import type { UrnComponentNames, ValidationRule, ValidationRuleObject } from './typings';

type BaseUrnLibOptions<TComp extends UrnComponentNames> = {
  components?: TComp;
  allowEmpty?: boolean;
  validationRules?: Array<ValidationRule | ValidationRuleObject>;
};

export type UrnLibOptions<TComp extends UrnComponentNames, TSep extends string> = BaseUrnLibOptions<TComp> & {
  separator?: TSep;
  /**
   * Default: true
   *
   * Prior to v3.0 the protocol could alternatively be passed inline
   * with the parsed object. Support for this is being removed and
   * being migrated to a symbol.
   */
  enableDeprecatedProtocol?: boolean;
};

export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: UrnLibOptions<TComp, TSep> & {
    enableDeprecatedProtocol?: true;
  }
): LegacyUrnUtil<TProt, TComp, TSep>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: UrnLibOptions<TComp, TSep> & {
    enableDeprecatedProtocol: false;
  }
): UrnUtil<TProt, TComp, TSep>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: UrnLibOptions<TComp, TSep> = {}
): UrnUtil<TProt, TComp, TSep> | LegacyUrnUtil<TProt, TComp, TSep> {
  const {
    components: rawComponents,
    allowEmpty = false,
    separator = RFC2141_SEPARATOR,
    validationRules,
    enableDeprecatedProtocol = true,
  } = options;
  const components = (rawComponents ?? RFC2141_COMPONENTS) as TComp;
  const utilOptions: UrnUtilOptions<TProt, TComp, TSep> = {
    protocol,
    components,
    separator: (separator ?? RFC2141_SEPARATOR) as TSep,
    validationRules: validationRules ?? generateDefaultValidationRules(components),
    allowEmpty,
  };
  return enableDeprecatedProtocol
    ? new LegacyUrnUtil(utilOptions)
    : new UrnUtil(utilOptions);
}
