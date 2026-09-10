import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { track, Events } from "./analytics";

const CartContext = createContext(null);
const STORAGE_KEY = "aviator_cart_v1";
const COUPON_KEY = "aviator_coupon_v1";

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
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
function lineKey({ productId, color, size }) {
  return [productId, color, size].filter(Boolean).join("::");
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
    setItems((prev) => {
      const key = lineKey(item);
      const existing = prev.find((p) => lineKey(p) === key);
      if (existing) {
        return prev.map((p) =>
          lineKey(p) === key ? { ...p, quantity: p.quantity + (item.quantity || 1) } : p,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1, key }];
    });
    setDrawerOpen(true);
    track(Events.ADD_TO_CART, { name: item.name, price: item.price, color: item.color, size: item.size });
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((p) => lineKey(p) !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    setItems((prev) =>
      prev.map((p) =>
        lineKey(p) === key ? { ...p, quantity: Math.max(1, quantity) } : p,
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
      clearCart,
      applyCoupon,
      removeCoupon,
      openDrawer,
      closeDrawer,
    }),
    [items, coupon, drawerOpen, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, applyCoupon, removeCoupon, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { lineKey };