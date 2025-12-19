import { expect } from 'chai';
import { Rfc2141Urn } from '../../src/parsers/rfc/rfc2141/Rfc2141Urn';
import { URNError } from '../../src/errors/URNError';

describe('Rfc2141Urn', () => {
  describe('constructor', () => {
    it('should create an empty URN with default values', () => {
      try {
        // @ts-expect-error value is required
        new Rfc2141Urn();
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
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      expect(urn.protocol).to.equal('urn:');
      expect(urn.nid).to.equal('isbn');
      expect(urn.nss).to.equal('0451450523');
      expect(urn.ref).to.equal('urn:isbn:0451450523');
    });
    it('should parse URN with complex NSS', () => {
      const urn = new Rfc2141Urn('urn:example:a123,z456');
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('a123,z456');
    });
    it('should normalize NID to lowercase', () => {
      const urn = new Rfc2141Urn('urn:ISBN:0451450523');
      expect(urn.nid).to.equal('isbn');
      expect(urn.ref).to.equal('urn:isbn:0451450523');
    });
  });
  describe('setters', () => {
    it('should update ref when nid is changed', () => {
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      urn.nid = 'issn';
      expect(urn.ref).to.equal('urn:issn:0451450523');
      expect(urn.value).to.equal('issn:0451450523');
    });
    it('should update ref when nss is changed', () => {
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      urn.nss = '9876543210';
      expect(urn.ref).to.equal('urn:isbn:9876543210');
    });
    it('should update all parts when ref is changed', () => {
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      urn.ref = 'urn:example:foo:bar';
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo:bar');
    });
    it('should update all parts when value is changed', () => {
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      urn.value = 'example:foo:bar';
      expect(urn.nid).to.equal('example');
      expect(urn.nss).to.equal('foo:bar');
      expect(urn.ref).to.equal('urn:example:foo:bar');
    });
  });
  describe('validation', () => {
    it('should throw on missing colon separator', () => {
      expect(() => new Rfc2141Urn('urn:isbn')).to.throw(URNError, 'missing colon separator');
    });
    it('should throw on NID too short', () => {
      expect(() => new Rfc2141Urn('urn:a:something')).to.throw(URNError, 'must be at least 2 characters');
    });
    it('should throw on NID too long', () => {
      const longNid = 'a'.repeat(33);
      expect(() => new Rfc2141Urn(`urn:${longNid}:something`)).to.throw(URNError, 'must not exceed 32 characters');
    });
    it('should throw on invalid NID format', () => {
      expect(() => new Rfc2141Urn('urn:inv@lid:something')).to.throw(URNError, 'Invalid NID');
    });
    it('should throw on empty NSS', () => {
      expect(() => new Rfc2141Urn('urn:isbn:')).to.throw(URNError, 'NSS cannot be empty');
    });
  });
  describe('valid NIDs', () => {
    it('should accept valid NIDs', () => {
      const validNids = ['ab', 'ABC', 'a-b-c', 'test123', '12test'];
      for (const nid of validNids) {
        expect(() => new Rfc2141Urn(`urn:${nid}:test`)).to.not.throw();
      }
    });
  });
  describe('toString', () => {
    it('should return ref', () => {
      const urn = new Rfc2141Urn('urn:isbn:0451450523');
      expect(urn.toString()).to.equal('urn:isbn:0451450523');
    });
  });
});
