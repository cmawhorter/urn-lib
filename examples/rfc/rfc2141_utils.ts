import { parseRfc2141Urn, formatRfc2141Urn, parseProtocol, formatProtocol } from '../../src/main'; // import ... from 'urn-lib'

const urn = 'urn:ietf:rfc:7230';

const {protocol, value} = parseProtocol(urn);
console.log('protocol', protocol); // protocol urn:
console.log('value', value); // value ietf:rfc:7230

const parsed = parseRfc2141Urn(value);
console.log('parsed', parsed);
// parsed { nid: 'ietf', nss: 'rfc:7230' }

const formatted = formatRfc2141Urn(parsed);
console.log('formatted', formatted);
// formatted ietf:rfc:7230

console.log('full', formatProtocol(protocol, formatted));
// full urn:ietf:rfc:7230
