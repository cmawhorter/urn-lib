import { expect } from 'chai';
import { parseUrn } from '../../src/legacy/lib/parse';

describe('tokenize', function() {
  const protocol = 'urn';
  const nid = 'i';
  const nss = 's';
  const components = [ 'nid', 'nss' ];
  const separator = ':';
  it('should split a string using a separator into a named hash', function() {
    expect(parseUrn(components, separator, 'urn:i:s')).to.deep.equal({ protocol: protocol, nid: nid, nss: nss });
  });
  it('should default to null for missing', function() {
    expect(parseUrn(components, separator, 'urn:i')).to.deep.equal({ protocol: protocol, nid: nid, nss: null });
  });
  it('should treat extra parts as the last component', function() {
    const lastComponent = 's:this:should:be:the:last:component:value';
    expect(parseUrn(components, separator, 'urn:i:'+lastComponent)).to.deep.equal({ protocol: protocol, nid: nid, nss: lastComponent });
  });
  it('should always parse a protocol', function() {
    expect(parseUrn(['blah'], separator, 'urn:a')).to.deep.equal({ protocol: 'urn', blah: 'a' });
  });
  it('should return null for invalid strings', function() {
    expect(parseUrn(components, separator, null)).to.equal(null);
    expect(parseUrn(components, separator, '')).to.equal(null);
  });
  it('should return null for incomplete strings', function() {
    expect(parseUrn(components, separator, 'urn')).to.equal(null);
    expect(parseUrn(components, separator, 'urn:')).to.be.an('object');
  });
  it('should throw if components is invalid', function() {
    expect(function() {
      parseUrn([], separator, 'urn:a:b');
    }).to.throw(/components not valid/);
    expect(function() {
      parseUrn(null as any, separator, 'urn:a:b');
    }).to.throw(/components not valid/);
    expect(function() {
      parseUrn('a,b,c' as any, separator, 'urn:a:b');
    }).to.throw(/components not valid/);
    expect(function() {
      parseUrn(true as any, separator, 'urn:a:b');
    }).to.throw(/components not valid/);
  });
});
