import { isString } from './validate.js';

export default function(protocol, components, separator, parsed) {
  protocol = parsed && parsed.hasOwnProperty('protocol') ? parsed.protocol : protocol;
  if (!isString(protocol)) throw new Error('protocol is missing or invalid');
  return protocol + separator + components.map(name => !isString(parsed[name]) ? '' : parsed[name]).join(separator);
}
