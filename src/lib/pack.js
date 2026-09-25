// Per-piece bundle helpers (packs of 2/4/6 boxers).
// A "pack" line stores an array of one color+size per unit in `item.pieces`.

export function isPackItem(item) {
  return Boolean(item && Array.isArray(item.pieces) && item.pieces.length > 1);
}

// Duplicate the last piece when growing, slice when shrinking.
export function normalizePieces(quantity, pieces) {
  const qty = Math.max(1, Math.floor(Number(quantity) || 1));
  const list = Array.isArray(pieces)
    ? pieces.filter((p) => p && (p.color || p.size))
    : [];
  if (list.length === 0) return [];
  if (list.length < qty) {
    const last = list[list.length - 1];
    return Array.from({ length: qty }, (_, i) => list[i] || { ...last });
  }
  return list.slice(0, qty);
}

// Packs never merge and are keyed by uid; single items keep the legacy key.
export function packAddKey(item) {
  if (isPackItem(item)) return `pack::${item.uid}`;
  return [item.productId, item.color, item.size].filter(Boolean).join("::");
}

export function uid() {
  return globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}