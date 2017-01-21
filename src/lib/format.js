import { isString } from './validate.js';

export default function(components, separator, parsed) {
  if (!parsed.hasOwnProperty('protocol') || !isString(parsed.protocol)) throw new Error('protocol is missing or invalid');
  return parsed.protocol + separator + components.map(name => !isString(parsed[name]) ? '' : parsed[name]).join(separator);
}
