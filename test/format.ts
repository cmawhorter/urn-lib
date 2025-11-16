import { expect } from 'chai';
import { formatUrn, formatUrnStrict } from '../src/lib/format';

describe('format', function() {
  const protocol = 'urn';
  const components = [ 'nid', 'nss' ];
  const separator = ':';
  describe('formatUrn', () => {
    it('should format a parsed urn to a string', function() {
      expect(
        formatUrn(
          null,
          components,
          separator,
          {protocol, nid: 'i', nss: 's'}
        )
      ).to.equal('urn:i:s');
    });
    it('should format a long urn', function() {
      expect(
        formatUrn(
          null,
          ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
          separator,
          {protocol, a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'}
        )
      ).to.equal('urn:a:b:c:d:e:f:g');
    });
    it('should default to empty strings for missing or invalid', function() {
      expect(
        formatUrn(
          null,
          ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
          separator,
          {protocol, a: 'a', g: 'g'}
        )
      ).to.equal('urn:a::::::g');
    });
    it('should throw if protocol is missing', function() {
      expect(function() {
        formatUrn(null, components, separator, { nid: 'i', nss: 's' });
      }).to.throw(/protocol is missing or invalid/);
      expect(function() {
        formatUrn(null, components, separator, { protocol: null, nid: 'i', nss: 's' });
      }).to.throw(/protocol is missing or invalid/);
      expect(function() {
        formatUrn(null, components, separator, { protocol: undefined as any, nid: 'i', nss: 's' });
      }).to.throw(/protocol is missing or invalid/);
      expect(function() {
        formatUrn(null, components, separator, { protocol: ['a'] as any, nid: 'i', nss: 's' });
      }).to.throw(/protocol is missing or invalid/);
    });
    it('should support passing the protocol as an argument', function() {
      expect(formatUrn(protocol, components, separator, { nid: 'i', nss: 's' })).to.equal('urn:i:s');
      expect(formatUrn('blah', components, separator, { nid: 'i', nss: 's' })).to.equal('blah:i:s');
    });
    it('should allow protocol to be overwritten in the supplied parsed object', function() {
      // should always use protocol passed with object
      expect(formatUrn('blah', components, separator, { protocol, nid: 'i', nss: 's' })).to.equal('urn:i:s');
    });
    it('should should not throw if protocol does not match #8', function() {
      const result = formatUrn(
        'blah',
        components,
        separator,
        { protocol: 'invalid', nid: 'i', nss: 's' }
      );
      expect(result).to.equal('invalid:i:s');
    });
  });
  describe('formatUrnStrict', () => {
    it('should should throw if protocol does not match #8', function() {
      expect(() => {
        formatUrnStrict(
          'blah',
          components,
          separator,
          { protocol: 'invalid', nid: 'i', nss: 's' }
        );
      }).to.throw(/protocol mismatch/);
      const result = formatUrnStrict(
        'blah',
        components,
        separator,
        { protocol: 'blah', nid: 'i', nss: 's' }
      );
      expect(result).to.equal('blah:i:s');
    });
  });
});
