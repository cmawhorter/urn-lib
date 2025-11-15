import { expect } from 'chai';
import { formatUrn } from '../src/lib/format';

describe('format', function() {
  const protocol = 'urn';
  const components = [ 'nid', 'nss' ];
  const separator = ':';
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
      formatUrn(null, components, separator, { protocol: undefined, nid: 'i', nss: 's' });
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
    expect(formatUrn('blah', components, separator, { protocol: protocol, nid: 'i', nss: 's' })).to.equal('urn:i:s');
  });
  it('should should not throw by default, if protocol does not match #8', function() {
    const resultDef = formatUrn('blah', components, separator, { protocol: 'invalid', nid: 'i', nss: 's' });
    expect(resultDef).to.equal('invalid:i:s');
    const resultExpl = formatUrn(
      'blah',
      components,
      separator,
      { protocol: 'invalid', nid: 'i', nss: 's' },
      {strictProtocol: false}
    );
    expect(resultExpl).to.equal('invalid:i:s');
  });
  it('should should throw, if strictProtocol enabled and protocol does not match #8', function() {
    expect(() => {
      formatUrn(
        'blah',
        components,
        separator,
        { protocol: 'invalid', nid: 'i', nss: 's' },
        {strictProtocol: true}
      );
    }).to.throw('protocol mismatch');
    const result = formatUrn(
      'blah',
      components,
      separator,
      { protocol: 'blah', nid: 'i', nss: 's' },
      {strictProtocol: true}
    );
    expect(result).to.equal('blah:i:s');
  });
});
