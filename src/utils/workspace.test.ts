import { describe, expect, it } from 'vitest';
import { addRecentToolId, readStored, toggleFavoriteId } from './workspace';

describe('workspace helpers', () => {
  it('returns the fallback when stored data is missing or invalid', () => {
    const storage = { getItem: () => '{invalid json' };

    expect(readStored('missing', ['default'], storage)).toEqual(['default']);
  });

  it('reads valid JSON from storage', () => {
    const storage = { getItem: () => '["json-prettify"]' };

    expect(readStored('favorites', [], storage)).toEqual(['json-prettify']);
  });

  it('adds and removes favorite tool ids without duplicates', () => {
    expect(toggleFavoriteId([], 'json-prettify')).toEqual(['json-prettify']);
    expect(toggleFavoriteId(['json-prettify'], 'json-prettify')).toEqual([]);
    expect(toggleFavoriteId(['json-prettify'], 'base64-encode')).toEqual(['json-prettify', 'base64-encode']);
  });

  it('moves a recent tool to the front and enforces the limit', () => {
    expect(addRecentToolId(['a', 'b', 'c'], 'b')).toEqual(['b', 'a', 'c']);
    expect(addRecentToolId(['a', 'b', 'c'], 'd', 3)).toEqual(['d', 'a', 'b']);
  });
});