import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import ProductViewer, { type ProductFinish } from '../product/ProductViewer';

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, items, count, setQuantity, remove } = useCart();
  const item = items[0];
  const finish: ProductFinish = item?.color === 'Red' || item?.color === 'Black' ? item.color : 'Cream';
  useEffect(() => {
    if (!drawerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [drawerOpen, setDrawerOpen]);
  return <AnimatePresence>
    {drawerOpen && <>
      <motion.button className="cart-scrim" aria-label="Close bag" onClick={() => setDrawerOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ duration: 0.28, ease: 'easeOut' }}>
        <header className="drawer-header"><div><p className="eyebrow">OBSIDIAN AUDIO</p><h2 id="drawer-title">Your bag <span>({count})</span></h2></div><button className="icon-button" aria-label="Close bag" onClick={() => setDrawerOpen(false)}><X size={20}/></button></header>
        {!item ? <div className="drawer-empty"><ShoppingBag size={27}/><h3>Your bag is empty.</h3><p>Make space for a more considered listen.</p><Link to="/product/obsidian-one" className="button button-gold" onClick={() => setDrawerOpen(false)}>Explore Obsidian One <ArrowRight size={15}/></Link></div> : <>
          <article className="drawer-item"><ProductViewer color={finish} compact interactive={false} className="drawer-product-model"/><div className="drawer-item-copy"><p className="eyebrow">STUDIO SERIES</p><h3>Obsidian One</h3><p>Premium wireless headphones</p><small>Finish: {item.color}</small><div className="cart-controls"><div className="quantity"><button type="button" onClick={() => setQuantity(item.quantity - 1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{item.quantity}</span><button type="button" onClick={() => setQuantity(item.quantity + 1)} aria-label="Increase quantity"><Plus size={13}/></button></div><button type="button" className="remove-button" onClick={remove}>Remove</button></div></div><b className="drawer-price">${(349 * item.quantity).toLocaleString()}</b></article>
          <div className="drawer-bottom"><p className="drawer-shipping"><span className="delivery-dot"/> Complimentary delivery in 3 to 5 days</p><div className="drawer-subtotal"><span>Subtotal</span><b>${(349 * item.quantity).toLocaleString()} USD</b></div><p className="checkout-note">Shipping and taxes are calculated at checkout.</p><Link to="/cart" className="button button-gold drawer-checkout" onClick={() => setDrawerOpen(false)}>View bag and continue <ArrowRight size={16}/></Link><button className="drawer-continue" onClick={() => setDrawerOpen(false)}>Continue exploring</button></div>
        </>}
      </motion.aside>
    </>}
  </AnimatePresence>;
}
