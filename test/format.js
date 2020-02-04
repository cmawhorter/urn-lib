'use strict';

var format = require('../src/lib/format.js').default;

describe('format', function() {
  var protocol = 'urn';
  var components = [ 'nid', 'nss' ];
  var separator = ':';
  it('should format a parsed urn to a string', function() {
    expect(format(null, components, separator, { protocol: protocol, nid: 'i', nss: 's' })).to.equal('urn:i:s');
  });
  it('should format a long urn', function() {
    expect(format(null, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ], separator, { protocol: protocol, a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g' })).to.equal('urn:a:b:c:d:e:f:g');
  });
  it('should default to empty strings for missing or invalid', function() {
    expect(format(null, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ], separator, { protocol: protocol, a: 'a', g: 'g' })).to.equal('urn:a::::::g');
  });
  it('should throw if protocol is missing', function() {
    expect(function() {
      format(null, components, separator, { nid: 'i', nss: 's' });
    }).to.throw(/protocol is missing or invalid/);
    expect(function() {
      format(null, components, separator, { protocol: null, nid: 'i', nss: 's' });
    }).to.throw(/protocol is missing or invalid/);
    expect(function() {
      format(null, components, separator, { protocol: void 0, nid: 'i', nss: 's' });
    }).to.throw(/protocol is missing or invalid/);
    expect(function() {
      format(null, components, separator, { protocol: ['a'], nid: 'i', nss: 's' });
    }).to.throw(/protocol is missing or invalid/);
  });
  it('should support passing the protocol as an argument', function() {
    expect(format(protocol, components, separator, { nid: 'i', nss: 's' })).to.equal('urn:i:s');
    expect(format('blah', components, separator, { nid: 'i', nss: 's' })).to.equal('blah:i:s');
  });
  it('should allow protocol to be overwritten in the supplied parsed object', function() {
    // should always use protocol passed with object
    expect(format('blah', components, separator, { protocol: protocol, nid: 'i', nss: 's' })).to.equal('urn:i:s');
  });
});
