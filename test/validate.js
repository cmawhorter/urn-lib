'use strict';

var validate = require('../src/lib/validate.js');

describe('validate', function() {
  describe('#isRfc2141NidString', function() {
    var chrs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-';

    describe('strictMode = false', function() {
      var strictMode = false;
      it('should validate rfc2141 nid strings', function() {
        expect(validate.isRfc2141NidString('', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('a', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(new Array(33).join('a'), strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(new Array(32).join('a'), strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('urn', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('arn', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('x-something', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('-something', strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString('something-', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(chrs, strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(chrs.split('').reverse().join(''), strictMode)).toEqual(false);
      });
      it('should treat null as an empty string', function() {
        expect(validate.isRfc2141NidString(null)).toEqual(true);
      });
      it('should fail for invalid types', function() {
        expect(validate.isRfc2141NidString(1)).toEqual(false);
        expect(validate.isRfc2141NidString(true)).toEqual(false);
        expect(validate.isRfc2141NidString({})).toEqual(false);
        expect(validate.isRfc2141NidString([])).toEqual(false);
      });
    });

    describe('strictMode = true', function() {
      var strictMode = true;
      it('should fail for non-string', function() {
        expect(validate.isRfc2141NidString(null, strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString([], strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString(true, strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString(1, strictMode)).toEqual(false);
      });
      it('should fail for too short', function() {
        expect(validate.isRfc2141NidString('', strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString('a', strictMode)).toEqual(true);
      });
      it('should fail for too long', function() {
        expect(validate.isRfc2141NidString(new Array(33).join('a'), strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString(new Array(32).join('a'), strictMode)).toEqual(true);
      });
      it('should fail for blacklist', function() {
        expect(validate.isRfc2141NidString('urn', strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString('arn', strictMode)).toEqual(true);
      });
      it('should fail for normal invalid', function() {
        expect(validate.isRfc2141NidString('x-something', strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString('-something', strictMode)).toEqual(false);
        expect(validate.isRfc2141NidString('something-', strictMode)).toEqual(true);
        var chunk1 = 'abcdefghijklmnopqrstuv';
        var chunk2 = 'wxyzABCDEFGHIJKLMNOPQR';
        var chunk3 = 'STUVWXYZ1234567890-';
        expect(validate.isRfc2141NidString(chunk1, strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(chunk2, strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(chunk3, strictMode)).toEqual(true);
        expect(validate.isRfc2141NidString(chunk3.split('').reverse().join(''), strictMode)).toEqual(false);
      });
    });
  });

  describe('#isString', function() {
    it('should validate strings', function() {
      expect(validate.isString('a')).toEqual(true);
      expect(validate.isString('')).toEqual(true);
      expect(validate.isString(null)).toEqual(false);
      expect(validate.isString(['a'])).toEqual(false);
    });
  });

  describe('#isProtocol', function() {
    it('should validate matching protocol', function() {
      expect(validate.isProtocol('a', { protocol: 'a' })).toEqual(true);
    });
    it('should be case-insensitive', function() {
      expect(validate.isProtocol('A', { protocol: 'a' })).toEqual(true);
    });
    it('should detect invalid protocol', function() {
      expect(validate.isProtocol('b', { protocol: 'a' })).toEqual(false);
      expect(validate.isProtocol(' a', { protocol: 'a' })).toEqual(false);
    });
    it('should not throw for invalid input', function() {
      expect(validate.isProtocol('a', { protocol: null })).toEqual(false);
      expect(validate.isProtocol('a', { protocol: ['a'] })).toEqual(false);
    });
  });

  describe('#isValid', function() {
    var parsed = { valid: 'a', conditional: '', invalid_null: null, invalid_undefined: void 0, invalid_arr: ['a'] };
    it('should handle valid components', function() {
      expect(validate.isValid(parsed, 'valid')).toEqual(true);
    });
    it('should handle invalid components', function() {
      expect(validate.isValid(parsed, 'invalid_null')).toEqual(false);
      expect(validate.isValid(parsed, 'invalid_undefined')).toEqual(false);
      expect(validate.isValid(parsed, 'invalid_arr')).toEqual(false);
    });
    it('should handle empty strings', function() {
      expect(validate.isValid(parsed, 'conditional', true)).toEqual(true);
      expect(validate.isValid(parsed, 'conditional')).toEqual(false);
      expect(validate.isValid(parsed, 'conditional', false)).toEqual(false);
    });
    it('should not throw for invalid property names', function() {
      expect(validate.isValid(parsed, 'not a valid name')).toEqual(false);
    });
  });

  describe('#urnObject', function() {
    var protocol        = 'p';
    var nid             = 'i';
    var nss             = 's';
    var customRules     = [];
    var allowZeroLength = true;
    it('should validate parsed', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).toEqual(null);
    });
    it('should detect invalid protocol', function() {
      var errors = validate.urnObject(protocol, customRules, allowZeroLength, { protocol: 'x', nid: nid, nss: nss });
      expect(errors).toBeAn(Array);
      expect(errors.length).toEqual(1);
    });
    it('should optionally allow empty strings', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: '', nss: nss })).toEqual(null);
      expect(validate.urnObject(protocol, customRules, false, { protocol: protocol, nid: '', nss: nss })).toBeAn(Array);
      expect(validate.urnObject(protocol, customRules, false, { protocol: protocol, nid: null, nss: nss })).toBeAn(Array);
    });
    it('should fail for missing and invalid components', function() {
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: null, nss: nss })).toBeAn(Array);
      expect(validate.urnObject(protocol, customRules, allowZeroLength, { protocol: protocol, nid: void 0, nss: nss })).toBeAn(Array);
    });
    it('should suport custom rules', function() {
      var successRules = [ [ 'nid', 'error', function(value) { return true; } ] ];
      var failRules = [ [ 'nid', 'error', function(value) { return false; } ] ];
      expect(validate.urnObject(protocol, successRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).toEqual(null);
      expect(validate.urnObject(protocol, failRules, allowZeroLength, { protocol: protocol, nid: nid, nss: nss })).toBeAn(Array);
    });
  });
});
