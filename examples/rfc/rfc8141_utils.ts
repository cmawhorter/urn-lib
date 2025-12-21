import { parseRfc8141Urn, formatRfc8141Urn, parseProtocol, formatProtocol } from '../../src/main'; // import ... from 'urn-lib'

const urn = 'urn:ietf:rfc:7230?+hello?=world#example';

const {protocol, value} = parseProtocol(urn);
console.log('protocol', protocol); // protocol urn:
console.log('value', value); // value ietf:rfc:7230?+hello?=world#example

const parsed = parseRfc8141Urn(value);
console.log('parsed', parsed);
// parsed {
//   nid: 'ietf',
//   nss: 'rfc:7230',
//   fComponent: '#example',
//   qComponent: '?=world',
//   rComponent: '?+hello'
// }

const formatted = formatRfc8141Urn(parsed);
console.log('formatted', formatted);
// formatted ietf:rfc:7230?+hello?=world#example

console.log('full', formatProtocol(protocol, formatted));
// full urn:ietf:rfc:7230?+hello?=world#example
