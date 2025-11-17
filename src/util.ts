import { UrnUtil } from './UrnUtil';
import type { DeprecatedProtoUrnUtil } from './IUrnUtil';
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
   * Prior to v4.x the protocol could alternatively be passed inline
   * with the parsed object. Support for this is being removed and
   * being migrated to a symbol.
   */
  enableDeprecatedProtocol?: boolean;
};

export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: BaseUrnLibOptions<TComp> & {
    enableDeprecatedProtocol?: true;
  }
): DeprecatedProtoUrnUtil<TProt, TComp, TSep, UrnUtil<TProt, TComp, TSep>>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: BaseUrnLibOptions<TComp> & {
    enableDeprecatedProtocol: false;
  }
): UrnUtil<TProt, TComp, TSep>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames, TSep extends string>(
  protocol: TProt,
  options: UrnLibOptions<TComp, TSep> = {}
): UrnUtil<TProt, TComp, TSep> | DeprecatedProtoUrnUtil<TProt, TComp, TSep, UrnUtil<TProt, TComp, TSep>> {
  const {
    components: rawComponents,
    allowEmpty = false,
    separator = RFC2141_SEPARATOR,
    validationRules,
    enableDeprecatedProtocol = true,
  } = options;
  const components = (rawComponents ?? RFC2141_COMPONENTS) as TComp;
  return new UrnUtil({
    protocol,
    components,
    separator: (separator ?? RFC2141_SEPARATOR) as TSep,
    validationRules: validationRules ?? generateDefaultValidationRules(components),
    allowEmpty,
    enableDeprecatedProtocol,
  });
}
