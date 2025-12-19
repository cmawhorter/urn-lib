import { Rfc2141Urn } from '../../src/main'; // import ... from 'urn-lib'
import type { IRfcUrn } from '../../src/parsers/rfc/IRfcUrn';

// There are a few different ways to achieve something like this
// and this implementation does not support updating properties
// of the underlying Rfc2141Urn. This was chosen here because
// it was the easiest way to demo the core features.

// If you need parsing and formatting only, this would probably
// better be achieved as simple functions.

// It's technically possible to have class `RfcIetfNss` extend
// `Rfc2141Urn` (instead of wrapping), but that's beyond the
// scope of this example.

// ============================================================
// Begin: ietf parser code
// ============================================================

// Note that this ietf parser is illustrative only and was built
// to parse our example input only. No attempt was made to follow
// the standard defined in the formal iety URN namespace. Let alone
// validation or any other important things.

type ParsedIetf = {type: string; id: string};
const parseIetfNss = (nss: string): ParsedIetf => {
  const [type, id] = nss.split(':');
  return {type, id};
};
const formatIetfNss = (parsed: ParsedIetf): string => parsed.type + ':' + parsed.id;

class RfcIetfNss implements IRfcUrn {
  private readonly _urn: Rfc2141Urn;

  public get ietfType(): string {return this._ietfType }
  public set ietfType(value: string) {
    this._ietfType = value;
    this._urn.nss = formatIetfNss({type: value, id: this._ietfId});
  }
  private _ietfType: string = '';

  public get ietfId(): string { return this._ietfId}
  public set ietfId(value: string) {
    this._ietfId = value;
    this._urn.nss = formatIetfNss({type: this._ietfType, id: value});
  }
  private _ietfId: string = '';

  get ref() { return this._urn.ref }
  get protocol() { return this._urn.protocol }
  get value() { return this._urn.value }
  get nid() { return this._urn.nid }
  get nss() { return this._urn.nss }

  constructor(
    urn: string
  ) {
    this._urn = new Rfc2141Urn(urn);
    if (this._urn.nid !== 'ietf') {
      throw new Error(`urn nid must be "ietf" but received "${this._urn.nid}"`);
    }
    const parsed = parseIetfNss(this._urn.nss);
    this._ietfType = parsed.type;
    this._ietfId = parsed.id;
  }

  toString() { return this._urn.toString() }

  toJSON() {
    return {
      ...this._urn.toJSON(),
      ietfType: this.ietfType,
      ietfId: this.ietfId,
    };
  }
}

// ============================================================
// End: ietf parser code
// ============================================================

// The rest is exemplifying using the ietf parser created above

const ietf = new RfcIetfNss('urn:ietf:rfc:7230');

console.log('parsed', {
  ref: ietf.ref,
  protocol: ietf.protocol,
  value: ietf.value,
  nid: ietf.nid,
  nss: ietf.nss,
  ietfType: ietf.ietfType,
  ietfId: ietf.ietfId,
});
// parsed {
//   ref: 'urn:ietf:rfc:7230',
//   protocol: 'urn:',
//   value: 'ietf:rfc:7230',
//   nid: 'ietf',
//   nss: 'rfc:7230',
//   ietfType: 'rfc',
//   ietfId: '7230'
// }

console.log('formatted', ietf.toString());
// formatted urn:ietf:rfc:7230

ietf.ietfId = '1234';
console.log('formatted change', ietf.toString());
// formatted change urn:ietf:rfc:1234
