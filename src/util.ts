import { UrnUtil, type UrnUtilOptions } from './UrnUtil';
import type { DeprecatedProtoUrnUtil } from './IUrnUtil';
import { generateDefaultValidationRules } from './lib/validate';
import { SEPARATOR as RFC2141_SEPARATOR, COMPONENTS as RFC2141_COMPONENTS } from './schemes/rfc2141';
import type { UrnComponentNames } from './typings';

type BaseLibOptions<T extends UrnComponentNames> = Partial<Pick<UrnUtilOptions<any, T>, 'components' | 'separator' | 'allowEmpty' | 'validationRules'>>;

export type UrnLibOptions<T extends UrnComponentNames> = BaseLibOptions<T> & {
  /**
   * Default: true
   *
   * Prior to v4.x the protocol could alternatively be passed inline
   * with the parsed object. Support for this is being removed and
   * being migrated to a symbol.
   */
  enableDeprecatedProtocol?: boolean;
};

export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames>(
  protocol: TProt,
  options: BaseLibOptions<TComp> & {enableDeprecatedProtocol?: true}
): DeprecatedProtoUrnUtil<TProt, TComp, UrnUtil<TProt, TComp>>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames>(
  protocol: TProt,
  options: BaseLibOptions<TComp> & {enableDeprecatedProtocol: false}
): UrnUtil<TProt, TComp>;
export function createUrnUtil<TProt extends string, TComp extends UrnComponentNames>(
  protocol: TProt,
  options: UrnLibOptions<TComp> = {}
): UrnUtil<TProt, TComp> | DeprecatedProtoUrnUtil<TProt, TComp, UrnUtil<TProt, TComp>> {
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
    separator: separator ?? RFC2141_SEPARATOR,
    validationRules: validationRules ?? generateDefaultValidationRules(components),
    allowEmpty,
    enableDeprecatedProtocol,
  });
}
