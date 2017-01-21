'use strict';

require('reify');
var tokenize = require('../src/lib/tokenize.js').default;

describe('tokenize', function() {
  var protocol = 'urn';
  var nid = 'i';
  var nss = 's';
  var components = [ 'nid', 'nss' ];
  var separator = ':';
  it('should split a string using a separator into a named hash', function() {
    expect(tokenize(components, separator, 'urn:i:s')).toEqual({ protocol, nid, nss });
  });
  it('should default to null for missing', function() {
    expect(tokenize(components, separator, 'urn:i')).toEqual({ protocol, nid, nss: null });
  });
  it('should treat extra parts as the last component', function() {
    var lastComponent = 's:this:should:be:the:last:component:value';
    expect(tokenize(components, separator, 'urn:i:'+lastComponent)).toEqual({ protocol, nid, nss: lastComponent });
  });
  it('should always parse a protocol', function() {
    expect(tokenize(['blah'], separator, 'urn:a')).toEqual({ protocol: 'urn', blah: 'a' });
  });
  it('should return null for invalid strings', function() {
    expect(tokenize(components, separator, null)).toEqual(null);
    expect(tokenize(components, separator, '')).toEqual(null);
  });
  it('should return null for incomplete strings', function() {
    expect(tokenize(components, separator, 'urn')).toEqual(null);
    expect(tokenize(components, separator, 'urn:')).toBeAn(Object);
  });
  it('should throw if components is invalid', function() {
    expect(() => tokenize([], separator, 'urn:a:b')).toThrow();
    expect(() => tokenize(null, separator, 'urn:a:b')).toThrow();
    expect(() => tokenize('a,b,c', separator, 'urn:a:b')).toThrow();
    expect(() => tokenize(true, separator, 'urn:a:b')).toThrow();
  });
});
