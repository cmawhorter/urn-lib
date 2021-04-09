import { expect } from 'chai';
import { isProtocol, isRfc2141NidString, isString, isValid, urnObject } from '../src/lib/validate';
import { ValidationRule } from '../src/typings';

describe('validate', function() {
  describe('#isRfc2141NidString', function() {
    const chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

    describe('strictMode = false', function() {
      const strictMode = false;
      it('should validate rfc2141 nid strings', function() {
        expect(isRfc2141NidString('', strictMode)).to.equal(true);
        expect(isRfc2141NidString('a', strictMode)).to.equal(true);
        expect(isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(true);
        expect(isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
        expect(isRfc2141NidString('urn', strictMode)).to.equal(true);
        expect(isRfc2141NidString('arn', strictMode)).to.equal(true);
        expect(isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(isRfc2141NidString('something-', strictMode)).to.equal(true);
        expect(isRfc2141NidString(chrs, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chrs.split('').reverse().join(''), strictMode)).to.equal(false);
      });
      it('should treat null as an empty string', function() {
        expect(isRfc2141NidString(null)).to.equal(true);
      });
      it('should fail for invalid types', function() {
        expect(isRfc2141NidString(1)).to.equal(false);
        expect(isRfc2141NidString(true)).to.equal(false);
        expect(isRfc2141NidString({})).to.equal(false);
        expect(isRfc2141NidString([])).to.equal(false);
      });
    });

    describe('strictMode = true', function() {
      const strictMode = true;
      it('should fail for non-string', function() {
        expect(isRfc2141NidString(null, strictMode)).to.equal(false);
        expect(isRfc2141NidString([], strictMode)).to.equal(false);
        expect(isRfc2141NidString(true, strictMode)).to.equal(false);
        expect(isRfc2141NidString(1, strictMode)).to.equal(false);
      });
      it('should fail for too short', function() {
        expect(isRfc2141NidString('', strictMode)).to.equal(false);
        expect(isRfc2141NidString('a', strictMode)).to.equal(true);
      });
      it('should fail for too long', function() {
        expect(isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(false);
        expect(isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
      });
      it('should fail for blacklist', function() {
        expect(isRfc2141NidString('urn', strictMode)).to.equal(false);
        expect(isRfc2141NidString('arn', strictMode)).to.equal(true);
      });
      it('should fail for normal invalid', function() {
        expect(isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(isRfc2141NidString('something-', strictMode)).to.equal(true);
        const chunk1 = 'abcdefghijklmnopqrstuv';
        const chunk2 = 'wxyzABCDEFGHIJKLMNOPQR';
        const chunk3 = 'STUVWXYZ1234567890-';
        expect(isRfc2141NidString(chunk1, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk2, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk3, strictMode)).to.equal(true);
        expect(isRfc2141NidString(chunk3.split('').reverse().join(''), strictMode)).to.equal(false);
      });
    });
  });

  describe('#isString', function() {
    it('should validate strings', function() {
      expect(isString('a')).to.equal(true);
      expect(isString('')).to.equal(true);
      expect(isString(null)).to.equal(false);
      expect(isString(['a'])).to.equal(false);
    });
  });

  describe('#isProtocol', function() {
    it('should validate matching protocol', function() {
      expect(isProtocol('a', { protocol: 'a' })).to.equal(true);
    });
    it('should be case-insensitive', function() {
      expect(isProtocol('A', { protocol: 'a' })).to.equal(true);
    });
    it('should detect invalid protocol', function() {
      expect(isProtocol('b', { protocol: 'a' })).to.equal(false);
      expect(isProtocol(' a', { protocol: 'a' })).to.equal(false);
    });
    it('should not throw for invalid input', function() {
      expect(isProtocol('a', { protocol: null })).to.equal(false);
      expect(isProtocol('a', { protocol: ['a'] })).to.equal(false);
    });
  });

  describe('#isValid', function() {
    const parsed = { valid: 'a', conditional: '', invalid_null: null, invalid_undefined: void 0, invalid_arr: ['a'] };
    it('should handle valid components', function() {
      expect(isValid(parsed, 'valid')).to.equal(true);
    });
    it('should handle invalid components', function() {
      expect(isValid(parsed, 'invalid_null')).to.equal(false);
      expect(isValid(parsed, 'invalid_undefined')).to.equal(false);
      expect(isValid(parsed, 'invalid_arr')).to.equal(false);
    });
    it('should handle empty strings', function() {
      expect(isValid(parsed, 'conditional', true)).to.equal(true);
      expect(isValid(parsed, 'conditional')).to.equal(false);
      expect(isValid(parsed, 'conditional', false)).to.equal(false);
    });
    it('should not throw for invalid property names', function() {
      expect(isValid(parsed, 'not a valid name')).to.equal(false);
    });
  });

  describe('#urnObject', function() {
    const protocol        = 'p';
    const nid             = 'i';
    const nss             = 's';
    const customRules: ValidationRule[] = [];
    const allowZeroLength = true;
    it('should validate parsed', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
    });
    it('should detect invalid protocol', function() {
      const errors = urnObject(protocol, customRules, allowZeroLength, { protocol: 'x', nid: nid, nss: nss });
      expect(errors).to.be.an('array');
      expect((errors as any).length).to.equal(1);
    });
    it('should optionally allow empty strings', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: '', nss: nss })).to.equal(null);
      expect(urnObject(protocol, customRules, false, { protocol: protocol, nid: '', nss: nss })).to.be.an('array');
      expect(urnObject(protocol, customRules, false, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
    });
    it('should fail for missing and invalid components', function() {
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
      expect(urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: void 0, nss: nss })).to.be.an('array');
    });
    it('should suport custom rules', function() {
      const successRules: ValidationRule[] = [ [ 'nid', 'error', function(value) { return true; } ] ];
      const failRules: ValidationRule[] = [ [ 'nid', 'error', function(value) { return false; } ] ];
      expect(urnObject(protocol, successRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
      expect(urnObject(protocol, failRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.be.an('array');
    });
  });
});
