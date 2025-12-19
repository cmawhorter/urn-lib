import { Rfc2141Urn } from '../../src/main'; // import ... from 'urn-lib'

const urn = new Rfc2141Urn('urn:ietf:rfc:7230');

console.log('parsed', {
  ref: urn.ref,
  protocol: urn.protocol,
  value: urn.value,
  nid: urn.nid,
  nss: urn.nss,
});
// parsed {
//   ref: 'urn:ietf:rfc:7230',
//   protocol: 'urn:',
//   value: 'ietf:rfc:7230',
//   nid: 'ietf',
//   nss: 'rfc:7230'
// }

console.log('formatted', urn.toString());
// formatted urn:ietf:rfc:7230
