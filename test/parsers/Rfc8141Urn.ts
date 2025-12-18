import { expect } from 'chai';
import { Rfc8141Urn } from '../../src/parsers/rfc/rfc8141/Rfc8141Urn';
import { URNError } from '../../src/errors/URNError';

describe('Rfc8141Urn', () => {
  describe('constructor', () => {
    it('should create an empty URN with default values', () => {
      try {
        // @ts-expect-error value is required
        new Rfc8141Urn();
        throw new Error('should not get here');
      }
      catch (err: any) {
        if (err.message.indexOf('must be specified') > -1) {
          return;
        }
        throw err;
      }
    });
    it('should parse a valid URN string', () => {
      const urn = new Rfc8141Urn('urn:example:foo:bar');
      expect(urn.protocol).to.equal('urn:');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo:bar');
      expect(urn.rComponent).to.equal('');
      expect(urn.qComponent).to.equal('');
      expect(urn.fComponent).to.equal('');
      expect(urn.ref).to.equal('urn:example:foo:bar');
    });
    it('should parse URN with r-component', () => {
      const urn = new Rfc8141Urn('urn:example:foo?+bar');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo');
      expect(urn.rComponent).to.equal('bar');
      expect(urn.qComponent).to.equal('');
      expect(urn.fComponent).to.equal('');
    });
    it('should parse URN with q-component', () => {
      const urn = new Rfc8141Urn('urn:example:foo?=bar');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo');
      expect(urn.rComponent).to.equal('');
      expect(urn.qComponent).to.equal('bar');
      expect(urn.fComponent).to.equal('');
    });
    it('should parse URN with f-component', () => {
      const urn = new Rfc8141Urn('urn:example:foo#bar');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo');
      expect(urn.rComponent).to.equal('');
      expect(urn.qComponent).to.equal('');
      expect(urn.fComponent).to.equal('bar');
    });
    it('should parse URN with all components', () => {
      const urn = new Rfc8141Urn('urn:example:foo?+rcomp?=qcomp#fcomp');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo');
      expect(urn.rComponent).to.equal('rcomp');
      expect(urn.qComponent).to.equal('qcomp');
      expect(urn.fComponent).to.equal('fcomp');
    });
    it('should normalize NID to lowercase', () => {
      const urn = new Rfc8141Urn('urn:EXAMPLE:foo');
      expect(urn.nid).to.equal('example');
      expect(urn.ref).to.equal('urn:example:foo');
    });
  });
  describe('setters', () => {
    it('should update ref when nid is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.nid = 'test';
      expect(urn.ref).to.equal('urn:test:foo');
      expect(urn.value).to.equal('test:foo');
    });
    it('should update ref when nss is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.nss = 'bar:baz';
      expect(urn.ref).to.equal('urn:example:bar:baz');
    });
    it('should update ref when rComponent is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.rComponent = 'resolution';
      expect(urn.ref).to.equal('urn:example:foo?+resolution');
    });
    it('should update ref when qComponent is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.qComponent = 'query';
      expect(urn.ref).to.equal('urn:example:foo?=query');
    });
    it('should update ref when fComponent is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.fComponent = 'fragment';
      expect(urn.ref).to.equal('urn:example:foo#fragment');
    });
    it('should update all parts when ref is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.ref = 'urn:test:bar?+r?=q#f';
      expect(urn.nid).to.equal('test');
      expect(urn.nss).to.equal('bar');
      expect(urn.rComponent).to.equal('r');
      expect(urn.qComponent).to.equal('q');
      expect(urn.fComponent).to.equal('f');
    });
    it('should update all parts when value is changed', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.value = 'test:bar?+r?=q#f';
      expect(urn.nid).to.equal('test');
      expect(urn.nss).to.equal('bar');
      expect(urn.rComponent).to.equal('r');
      expect(urn.qComponent).to.equal('q');
      expect(urn.fComponent).to.equal('f');
      expect(urn.ref).to.equal('urn:test:bar?+r?=q#f');
    });
    it('should maintain component order when formatting', () => {
      const urn = new Rfc8141Urn('urn:example:foo');
      urn.fComponent = 'frag';
      urn.qComponent = 'query';
      urn.rComponent = 'res';
      expect(urn.ref).to.equal('urn:example:foo?+res?=query#frag');
    });
  });
  describe('validation', () => {
    it('should throw on missing colon separator', () => {
      expect(() => new Rfc8141Urn('urn:example')).to.throw(URNError, 'missing colon separator');
    });
    it('should throw on NID too short', () => {
      expect(() => new Rfc8141Urn('urn:a:something')).to.throw(URNError, 'must be at least 2 characters');
    });
    it('should throw on NID too long', () => {
      const longNid = 'a'.repeat(33);
      expect(() => new Rfc8141Urn(`urn:${longNid}:something`)).to.throw(URNError, 'must not exceed 32 characters');
    });
    it('should throw on invalid NID format', () => {
      expect(() => new Rfc8141Urn('urn:inv@lid:something')).to.throw(URNError, 'Invalid NID');
    });
    it('should throw on empty NSS', () => {
      expect(() => new Rfc8141Urn('urn:example:')).to.throw(URNError, 'NSS cannot be empty');
    });
  });
  describe('toString', () => {
    it('should return ref', () => {
      const urn = new Rfc8141Urn('urn:example:foo?+r?=q#f');
      expect(urn.toString()).to.equal('urn:example:foo?+r?=q#f');
    });
  });
});
