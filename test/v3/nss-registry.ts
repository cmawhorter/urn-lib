/**
 * NSS Registry tests
 */

import { expect } from 'chai';
import { NSSRegistry } from '../../src/nss/registry';
import { DefaultNSSParser } from '../../src/nss/parsers/default';
import { HierarchicalParser } from '../../src/nss/parsers/hierarchical';

describe('NSS Registry', () => {
  describe('register/unregister', () => {
    it('should register parser for NID', () => {
      const registry = new NSSRegistry();
      const parser = new HierarchicalParser({ separator: ':' });

      registry.register('example', parser);
      expect(registry.hasParser('example')).to.be.true;
    });

    it('should unregister parser', () => {
      const registry = new NSSRegistry();
      const parser = new HierarchicalParser({ separator: ':' });

      registry.register('example', parser);
      const removed = registry.unregister('example');

      expect(removed).to.be.true;
      expect(registry.hasParser('example')).to.be.false;
    });

    it('should treat NID as case-insensitive', () => {
      const registry = new NSSRegistry();
      const parser = new HierarchicalParser({ separator: ':' });

      registry.register('EXAMPLE', parser);
      expect(registry.hasParser('example')).to.be.true;
      expect(registry.hasParser('Example')).to.be.true;
    });
  });

  describe('getParser', () => {
    it('should return registered parser', () => {
      const registry = new NSSRegistry();
      const parser = new HierarchicalParser({ separator: ':' });

      registry.register('example', parser);
      const retrieved = registry.getParser('example');

      expect(retrieved).to.equal(parser);
    });

    it('should return fallback for unregistered NID', () => {
      const fallback = new DefaultNSSParser();
      const registry = new NSSRegistry(fallback);

      const parser = registry.getParser('unknown');
      expect(parser).to.equal(fallback);
    });
  });

  describe('parseFull', () => {
    it('should parse NSS using registered parser', () => {
      const registry = new NSSRegistry();
      registry.register('example', new HierarchicalParser({ separator: ':' }));

      const result = registry.parseFull('example', 'a:b:c');
      expect(result).to.deep.include({ parts: ['a', 'b', 'c'] });
    });

    it('should use fallback for unregistered NID', () => {
      const registry = new NSSRegistry();
      const result = registry.parseFull('unknown', 'test');

      expect(result).to.deep.equal({ value: 'test' });
    });
  });

  describe('getRegisteredNIDs', () => {
    it('should return list of registered NIDs', () => {
      const registry = new NSSRegistry();
      registry.register('foo', new DefaultNSSParser());
      registry.register('bar', new DefaultNSSParser());

      const nids = registry.getRegisteredNIDs();
      expect(nids).to.have.members(['foo', 'bar']);
    });
  });

  describe('clear', () => {
    it('should remove all registrations', () => {
      const registry = new NSSRegistry();
      registry.register('foo', new DefaultNSSParser());
      registry.register('bar', new DefaultNSSParser());

      registry.clear();

      expect(registry.getRegisteredNIDs()).to.be.empty;
    });
  });
});
