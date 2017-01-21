import { isString } from './validate.js';

export default function(components, separator, str) {
  if (!Array.isArray(components) || components.length < 1) throw new Error('components not valid');
  if (!isString(str)) return null;
  let parts     = str.split(separator);
  if (parts.length < 2) return null;
  let protocol  = parts.shift(); // all schemes have a protocol
  let parsed    = { protocol };
  let len       = components.length - 1; // last component treated differently
  for (let i=0; i < len; i++) {
    let name = components[i];
    parsed[name] = parts.length ? parts.shift() : null;
  }
  // concat last component.  anything beyond what's defined in components
  // is a single string that belongs to last part
  let lastPartName      = components[len];
  parsed[lastPartName]  = parts.length ? parts.join(separator) : null;
  return parsed;
}
