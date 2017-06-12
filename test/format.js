'use strict';

require('reify');
var format = require('../src/lib/format.js').default;

describe('format', function() {
  var protocol = 'urn';
  var components = [ 'nid', 'nss' ];
  var separator = ':';
  it('should format a parsed urn to a string', function() {
    expect(format(null, components, separator, { protocol, nid: 'i', nss: 's' })).toEqual('urn:i:s');
  });
  it('should format a long urn', function() {
    expect(format(null, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ], separator, { protocol, a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g' })).toEqual('urn:a:b:c:d:e:f:g');
  });
  it('should default to empty strings for missing or invalid', function() {
    expect(format(null, [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ], separator, { protocol, a: 'a', g: 'g' })).toEqual('urn:a::::::g');
  });
  it('should throw if protocol is missing', function() {
    expect(() => format(null, components, separator, { nid: 'i', nss: 's' })).toThrow();
    expect(() => format(null, components, separator, { protocol: null, nid: 'i', nss: 's' })).toThrow();
    expect(() => format(null, components, separator, { protocol: void 0, nid: 'i', nss: 's' })).toThrow();
    expect(() => format(null, components, separator, { protocol: ['a'], nid: 'i', nss: 's' })).toThrow();
  });
  it('should support passing the protocol as an argument', function() {
    expect(format(protocol, components, separator, { nid: 'i', nss: 's' })).toEqual('urn:i:s');
    expect(format('blah', components, separator, { nid: 'i', nss: 's' })).toEqual('blah:i:s');
  });
  it('should allow protocol to be overwritten in the supplied parsed object', function() {
    // should always use protocol passed with object
    expect(format('blah', components, separator, { protocol, nid: 'i', nss: 's' })).toEqual('urn:i:s');
  });
});
