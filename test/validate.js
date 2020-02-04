'use strict';

var validate = require('../src/lib/validate.js');

describe('validate', function() {
  describe('#isRfc2141NidString', function() {
    var chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

    describe('strictMode = false', function() {
      var strictMode = false;
      it('should validate rfc2141 nid strings', function() {
        expect(validate.isRfc2141NidString('', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('a', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('urn', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('arn', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString('something-', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(chrs, strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(chrs.split('').reverse().join(''), strictMode)).to.equal(false);
      });
      it('should treat null as an empty string', function() {
        expect(validate.isRfc2141NidString(null)).to.equal(true);
      });
      it('should fail for invalid types', function() {
        expect(validate.isRfc2141NidString(1)).to.equal(false);
        expect(validate.isRfc2141NidString(true)).to.equal(false);
        expect(validate.isRfc2141NidString({})).to.equal(false);
        expect(validate.isRfc2141NidString([])).to.equal(false);
      });
    });

    describe('strictMode = true', function() {
      var strictMode = true;
      it('should fail for non-string', function() {
        expect(validate.isRfc2141NidString(null, strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString([], strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString(true, strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString(1, strictMode)).to.equal(false);
      });
      it('should fail for too short', function() {
        expect(validate.isRfc2141NidString('', strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString('a', strictMode)).to.equal(true);
      });
      it('should fail for too long', function() {
        expect(validate.isRfc2141NidString(new Array(33).join('a'), strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString(new Array(32).join('a'), strictMode)).to.equal(true);
      });
      it('should fail for blacklist', function() {
        expect(validate.isRfc2141NidString('urn', strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString('arn', strictMode)).to.equal(true);
      });
      it('should fail for normal invalid', function() {
        expect(validate.isRfc2141NidString('x-something', strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString('-something', strictMode)).to.equal(false);
        expect(validate.isRfc2141NidString('something-', strictMode)).to.equal(true);
        var chunk1 = 'abcdefghijklmnopqrstuv';
        var chunk2 = 'wxyzABCDEFGHIJKLMNOPQR';
        var chunk3 = 'STUVWXYZ1234567890-';
        expect(validate.isRfc2141NidString(chunk1, strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(chunk2, strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(chunk3, strictMode)).to.equal(true);
        expect(validate.isRfc2141NidString(chunk3.split('').reverse().join(''), strictMode)).to.equal(false);
      });
    });
  });

  describe('#isString', function() {
    it('should validate strings', function() {
      expect(validate.isString('a')).to.equal(true);
      expect(validate.isString('')).to.equal(true);
      expect(validate.isString(null)).to.equal(false);
      expect(validate.isString(['a'])).to.equal(false);
    });
  });

  describe('#isProtocol', function() {
    it('should validate matching protocol', function() {
      expect(validate.isProtocol('a', { protocol: 'a' })).to.equal(true);
    });
    it('should be case-insensitive', function() {
      expect(validate.isProtocol('A', { protocol: 'a' })).to.equal(true);
    });
    it('should detect invalid protocol', function() {
      expect(validate.isProtocol('b', { protocol: 'a' })).to.equal(false);
      expect(validate.isProtocol(' a', { protocol: 'a' })).to.equal(false);
    });
    it('should not throw for invalid input', function() {
      expect(validate.isProtocol('a', { protocol: null })).to.equal(false);
      expect(validate.isProtocol('a', { protocol: ['a'] })).to.equal(false);
    });
  });

  describe('#isValid', function() {
    var parsed = { valid: 'a', conditional: '', invalid_null: null, invalid_undefined: void 0, invalid_arr: ['a'] };
    it('should handle valid components', function() {
      expect(validate.isValid(parsed, 'valid')).to.equal(true);
    });
    it('should handle invalid components', function() {
      expect(validate.isValid(parsed, 'invalid_null')).to.equal(false);
      expect(validate.isValid(parsed, 'invalid_undefined')).to.equal(false);
      expect(validate.isValid(parsed, 'invalid_arr')).to.equal(false);
    });
    it('should handle empty strings', function() {
      expect(validate.isValid(parsed, 'conditional', true)).to.equal(true);
      expect(validate.isValid(parsed, 'conditional')).to.equal(false);
      expect(validate.isValid(parsed, 'conditional', false)).to.equal(false);
    });
    it('should not throw for invalid property names', function() {
      expect(validate.isValid(parsed, 'not a valid name')).to.equal(false);
    });
  });

  describe('#urnObject', function() {
    var protocol        = 'p';
    var nid             = 'i';
    var nss             = 's';
    var customRules     = [];
    var allowZeroLength = true;
    it('should validate parsed', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
    });
    it('should detect invalid protocol', function() {
      var errors = validate.urnObject(protocol, customRules, allowZeroLength, { protocol: 'x', nid: nid, nss: nss });
      expect(errors).to.be.an('array');
      expect(errors.length).to.equal(1);
    });
    it('should optionally allow empty strings', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: '', nss: nss })).to.equal(null);
      expect(validate.urnObject(protocol, customRules, false, { protocol: protocol, nid: '', nss: nss })).to.be.an('array');
      expect(validate.urnObject(protocol, customRules, false, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
    });
    it('should fail for missing and invalid components', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: null, nss: nss })).to.be.an('array');
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: void 0, nss: nss })).to.be.an('array');
    });
    it('should suport custom rules', function() {
      var successRules = [ [ 'nid', 'error', function(value) { return true; } ] ];
      var failRules = [ [ 'nid', 'error', function(value) { return false; } ] ];
      expect(validate.urnObject(protocol, successRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.equal(null);
      expect(validate.urnObject(protocol, failRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).to.be.an('array');
    });
  });
});
