import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'cc_cart_v1';

const CartContext = createContext(null);

export const useCartModule = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartModule must be used within CartProvider');
  return ctx;
};

export const CartProvider = ({ children, initial = [] }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      console.error('Failed reading cart from localStorage', e);
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed writing cart to localStorage', e);
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: Math.min((p.quantity || 0) + qty, product.stock || 9999) } : p);
      }
      return [...prev, { ...product, quantity: Math.min(qty, product.stock || 9999) }];
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) => prev.map((p) => p.id === productId ? { ...p, quantity: Math.max(1, Math.min(quantity, p.stock || 9999)) } : p));
  };

  const clear = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((s, it) => s + (it.quantity || 0), 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.quantity || 0) * (it.precio || it.price || 0), 0), [items]);
  const shipping = useMemo(() => (subtotal > 0 ? 5000 : 0), [subtotal]); // Costo de envío fijo: $5.000
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]); // Total = Subtotal + Envío

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    itemCount,
    subtotal,
    shipping,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
