import { expect } from 'chai';
import { RFC2141 } from '../src/main';

describe('RFC2141', function() {
  it('should export an instance for parsing RFC2141 urns [Legacy 3.x]', function() {
    const canned = [
      'urn:isbn:0451450523',
      'urn:isan:0000-0000-9E59-0000-O-0000-0000-2',
      'urn:ISSN:0167-6423',
      'urn:ietf:rfc:2648',
      'urn:mpeg:mpeg7:schema:2001',
      'urn:oid:2.16.840',
      'urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66',
      'urn:nbn:de:bvb:19-146642',
      'urn:lex:eu:council:directive:2010-03-09;2010-19-UE',
    ];
    for (const urn of canned) {
      const parsed = RFC2141.parse(urn)!;
      expect(parsed.protocol).to.equal('urn');
      const formatted = RFC2141.format(parsed);
      expect(formatted).to.equal(urn, `failed: ${urn}`);
    }
  });
});
