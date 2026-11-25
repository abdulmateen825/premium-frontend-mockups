import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
type Item = { id: string; quantity: number; color: string };
type CartApi = { items: Item[]; count: number; add: (color: string, quantity?: number) => void; setQuantity: (quantity: number) => void; remove: () => void; clear: () => void; drawerOpen: boolean; setDrawerOpen: (open: boolean) => void };
const CartContext = createContext<CartApi | null>(null);
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const add = (color: string, quantity = 1) => setItems(old => { const current = old.find(i => i.id === 'obsidian-one'); return current ? old.map(i => i.id === current.id ? { ...i, quantity: i.quantity + quantity, color } : i) : [{ id: 'obsidian-one', quantity, color }]; });
  const setQuantity = (quantity: number) => setItems(old => quantity < 1 ? [] : old.map(i => ({ ...i, quantity })));
  const remove = () => setItems([]);
  const value = useMemo(() => ({ items, count: items.reduce((n, i) => n + i.quantity, 0), add, setQuantity, remove, clear: remove, drawerOpen, setDrawerOpen }), [items, drawerOpen]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error('useCart must be used inside CartProvider'); return value; }

