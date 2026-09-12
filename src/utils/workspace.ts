export interface StorageLike {
  getItem: (key: string) => string | null;
}

export const STORAGE_KEYS = {
  favorites: 'devtoolkit:favorites',
  recentTools: 'devtoolkit:recent-tools',
  theme: 'devtoolkit:theme',
  density: 'devtoolkit:density'
} as const;

export function readStored<T>(key: string, fallback: T, storage: StorageLike): T {
  try {
    const value = storage.getItem(key);
    return value ? JSON.parse(value) as T : fallback;
  } catch {
    return fallback;
  }
}

export function toggleFavoriteId(favoriteIds: string[], toolId: string): string[] {
  return favoriteIds.includes(toolId)
    ? favoriteIds.filter(id => id !== toolId)
    : [...favoriteIds, toolId];
}

export function addRecentToolId(recentToolIds: string[], toolId: string, limit = 8): string[] {
  return [toolId, ...recentToolIds.filter(id => id !== toolId)].slice(0, limit);
}