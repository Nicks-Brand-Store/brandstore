import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const { addToast } = useToast();

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <nav>
          <Link to="/products" className="btn-link">Continue Shopping</Link>
        </nav>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/products" className="btn-primary">Shop Now</Link>
        </div>
      ) : (
        <div className="cart-grid">
          <div className="cart-items">
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.images?.[0] || ''} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="muted">₹{item.price.toFixed(2)}</p>
                  <div className="quantity-row">
                    <label>
                      Qty
                      <div className="qty-control">
                        <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="qty-input"
                        />
                        <button type="button" className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </label>
                    <button className="btn-ghost" onClick={() => { removeFromCart(item.id); addToast(`${item.name} removed from cart`); }}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Items</span>
              <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total</strong>
              <strong>₹{getTotal().toFixed(2)}</strong>
            </div>
            <Link to="/checkout" className="btn-primary">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;