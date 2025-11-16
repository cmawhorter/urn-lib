import { COMPONENTS, PREFIX, SEPARATOR } from './schemes/rfc2141';
import { createUrnUtil } from './util';

export const RFC2141 = createUrnUtil(PREFIX, {
  components:       COMPONENTS,
  separator:        SEPARATOR,
  allowEmpty:       false,
  enableDeprecatedProtocol: true,
});
