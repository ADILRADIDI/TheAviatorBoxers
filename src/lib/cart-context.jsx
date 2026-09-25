import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { track, Events } from "./analytics";
import { isPackItem, normalizePieces, packAddKey, uid } from "./pack";

const CartContext = createContext(null);
const STORAGE_KEY = "aviator_cart_v1";
const COUPON_KEY = "aviator_coupon_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && item.productId && Number(item.price) >= 0)
      .map((item) => ({
        ...item,
        quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
      }));
  } catch {
    return [];
  }
}

function loadCoupon() {
  try {
    const raw = localStorage.getItem(COUPON_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Generate a unique line key for a product variant
function lineKey(item) {
  if (item?.key) return item.key;
  return [item.productId, item.color, item.size].filter(Boolean).join("::");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [coupon, setCoupon] = useState(loadCoupon);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
  }, [coupon]);

  const addItem = useCallback((item) => {
    const isPack = isPackItem(item);
    const prepared = isPack ? { ...item, uid: item.uid || uid() } : item;
    const nextKey = isPack ? packAddKey(prepared) : lineKey(item);
    setItems((prev) => {
      const stock = Number.isFinite(Number(prepared.stock)) ? Math.max(0, Number(prepared.stock)) : Infinity;
      if (stock === 0) return prev;
      if (isPack) {
        if (prev.find((p) => lineKey(p) === nextKey)) return prev;
        const cappedPieces = prepared.pieces.slice(0, Math.floor(stock));
        const first = cappedPieces[0];
        return [...prev, {
          ...prepared,
          key: nextKey,
          pieces: cappedPieces,
          quantity: cappedPieces.length,
          color: first.color,
          size: first.size,
          colorOptions: prepared.colorOptions || [{ name: first.color, hex: "" }],
          sizeOptions: prepared.sizeOptions || [first.size],
          stock,
        }];
      }
      const existing = prev.find((p) => lineKey(p) === nextKey);
      const requested = Math.max(1, Math.floor(Number(prepared.quantity) || 1));
      if (existing) {
        const nextQuantity = Math.min(stock, existing.quantity + requested);
        return prev.map((p) =>
          lineKey(p) === nextKey ? { ...p, quantity: nextQuantity, stock } : p,
        );
      }
      return [...prev, { ...prepared, quantity: Math.min(stock, requested), key: nextKey, stock }];
    });
    setDrawerOpen(true);
    track(Events.ADD_TO_CART, { name: item.name, price: item.price, color: item.color, size: item.size });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((p) => {
        if (lineKey(p) !== key) return p;
        const capped = Math.min(Number.isFinite(Number(p.stock)) ? Math.max(1, Number(p.stock)) : Infinity, Math.max(1, Math.floor(Number(quantity) || 1)));
        return isPackItem(p)
          ? { ...p, quantity: capped, pieces: normalizePieces(capped, p.pieces) }
          : { ...p, quantity: capped };
      }),
    );
  }, []);

  const updatePiece = useCallback((key, index, patch) => {
    setItems((prev) =>
      prev.map((p) =>
        lineKey(p) === key
          ? {
              ...p,
              pieces: Array.isArray(p.pieces)
                ? p.pieces.map((pc, i) => (i === index ? { ...pc, ...patch } : pc))
                : p.pieces,
            }
          : p,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback((c) => setCoupon(c), []);
  const removeCoupon = useCallback(() => setCoupon(null), []);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      coupon,
      drawerOpen,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      updatePiece,
      clearCart,
      applyCoupon,
      removeCoupon,
      openDrawer,
      closeDrawer,
    }),
    [items, coupon, drawerOpen, itemCount, subtotal, addItem, removeItem, updateQuantity, updatePiece, clearCart, applyCoupon, removeCoupon, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { lineKey };