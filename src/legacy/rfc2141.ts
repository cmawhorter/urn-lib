import { COMPONENTS, PREFIX, SEPARATOR } from './schemes/rfc2141';
import { createUrnUtil } from './util';

/**
 * @deprecated
 * This is v2 legacy code from this lib that will only be available via '@cmawhorter/urn/legacy' in v4 of this lib
 */
export const RFC2141 = createUrnUtil(PREFIX, {
  components:       COMPONENTS,
  separator:        SEPARATOR,
  allowEmpty:       false,
});
