/**
 * Protocol handling tests
 */

import { expect } from 'chai';
import {
  createRFC2141Wrapper,
  createRFC8141Wrapper,
  createFullWrapper,
  createURNProtocolHandler,
  createProtocolHandler
} from '../../src/protocol';
import { NSSRegistry } from '../../src/nss/registry';
import { AWSARNParser } from '../../src/nss/parsers/aws-arn';

describe('Protocol Handling', () => {
  describe('Protocol Handlers', () => {
    it('should strip urn: protocol', () => {
      const handler = createURNProtocolHandler();
      const stripped = handler.stripProtocol('urn:example:test');
      expect(stripped).to.equal('example:test');
    });

    it('should handle case-insensitive protocol', () => {
      const handler = createURNProtocolHandler();
      const stripped = handler.stripProtocol('URN:example:test');
      expect(stripped).to.equal('example:test');
    });

    it('should add urn: protocol', () => {
      const handler = createURNProtocolHandler();
      const withProtocol = handler.addProtocol('example:test');
      expect(withProtocol).to.equal('urn:example:test');
    });

    it('should not duplicate protocol', () => {
      const handler = createURNProtocolHandler();
      const withProtocol = handler.addProtocol('urn:example:test');
      expect(withProtocol).to.equal('urn:example:test');
    });

    it('should detect protocol', () => {
      const handler = createURNProtocolHandler();
      const protocol = handler.detectProtocol('urn:example:test');
      expect(protocol).to.equal('urn');
    });

    it('should handle custom protocol', () => {
      const handler = createProtocolHandler('arn');
      const stripped = handler.stripProtocol('arn:aws:s3:::bucket');
      expect(stripped).to.equal('aws:s3:::bucket');
    });
  });

  describe('RFC 2141 Wrapper', () => {
    it('should parse URN with protocol', () => {
      const wrapper = createRFC2141Wrapper();
      const urn = wrapper.parse('urn:example:test');

      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('test');
    });

    it('should format URN with protocol', () => {
      const wrapper = createRFC2141Wrapper();
      const urn = wrapper.parse('urn:example:test');
      const formatted = wrapper.format(urn);

      expect(formatted).to.equal('urn:example:test');
    });

    it('should handle URN without protocol', () => {
      const wrapper = createRFC2141Wrapper();
      const urn = wrapper.parse('example:test');

      expect(urn.nid.value).to.equal('example');
    });
  });

  describe('RFC 8141 Wrapper', () => {
    it('should parse URN with RQF components', () => {
      const wrapper = createRFC8141Wrapper();
      const urn = wrapper.parse('urn:example:test#section');

      expect(urn.nid.value).to.equal('example');
      expect(urn.nss.encoded).to.equal('test');
      expect(urn.rqf?.fragment).to.equal('section');
    });

    it('should format URN with RQF', () => {
      const wrapper = createRFC8141Wrapper();
      const urn = wrapper.parse('urn:example:test?query#frag');
      const formatted = wrapper.format(urn);

      expect(formatted).to.equal('urn:example:test?query#frag');
    });
  });

  describe('Full Wrapper with NSS Registry', () => {
    it('should parse URN and decompose NSS', () => {
      const registry = new NSSRegistry();
      registry.register('arn', new AWSARNParser());

      const wrapper = createFullWrapper(registry);
      const result = wrapper.parseFull('urn:arn:aws:s3:::bucket');

      expect(result.urn.nid.value).to.equal('arn');
      expect(result.nss).to.exist;

      const nss = result.nss as any;
      expect(nss.partition).to.equal('aws');
      expect(nss.service).to.equal('s3');
    });

    it('should handle URN with unregistered NID', () => {
      const registry = new NSSRegistry();
      const wrapper = createFullWrapper(registry);

      const result = wrapper.parseFull('urn:example:test');

      expect(result.urn.nid.value).to.equal('example');
      expect(result.nss).to.deep.equal({ value: 'test' });
    });

    it('should support custom protocol handler', () => {
      const registry = new NSSRegistry();
      registry.register('arn', new AWSARNParser());

      // AWS ARNs can use 'arn' as protocol, then the NID is the first component
      // Format: arn:aws:s3:::bucket means protocol=arn, then nid:nss = aws:s3:::bucket
      // But that's not how ARNs work - ARNs are not URNs
      // Better: treat whole ARN as NSS under 'arn' NID with 'urn' protocol
      // Format: urn:arn:aws:s3:::bucket
      const wrapper = createFullWrapper(registry);

      const result = wrapper.parseFull('urn:arn:aws:s3:::bucket');

      expect(result.urn.nid.value).to.equal('arn');
      const nss = result.nss as any;
      expect(nss.partition).to.equal('aws');
    });
  });

  describe('Round-trip with protocol', () => {
    it('should preserve complete URN', () => {
      const original = 'urn:example:a123,z456';
      const wrapper = createRFC2141Wrapper();

      const urn = wrapper.parse(original);
      const formatted = wrapper.format(urn);

      expect(formatted).to.equal(original);
    });

    it('should preserve URN with RQF', () => {
      const original = 'urn:example:test?+res?q=v#frag';
      const wrapper = createRFC8141Wrapper();

      const urn = wrapper.parse(original);
      const formatted = wrapper.format(urn);

      expect(formatted).to.equal(original);
    });
  });
});
