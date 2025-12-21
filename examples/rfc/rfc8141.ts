import { Rfc8141Urn } from '../../src/main'; // import ... from 'urn-lib'

const urn = new Rfc8141Urn('urn:ietf:rfc:7230?+hello?=world#example');

console.log('parsed', {
  ref: urn.ref,
  protocol: urn.protocol,
  value: urn.value,
  nid: urn.nid,
  nss: urn.nss,
  rComponent: urn.rComponent,
  qComponent: urn.qComponent,
  fComponent: urn.fComponent,
});
// parsed {
//   ref: 'urn:ietf:rfc:7230?+hello?=world#example',
//   protocol: 'urn:',
//   value: 'ietf:rfc:7230?+hello?=world#example',
//   nid: 'ietf',
//   nss: 'rfc:7230',
//   rComponent: '?+hello',
//   qComponent: '?=world',
//   fComponent: '#example'
// }

console.log('formatted', urn.toString());
// formatted urn:ietf:rfc:7230?+hello?=world#example
