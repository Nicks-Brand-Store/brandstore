import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

function Checkout() {
  const { cart, getTotal, clearCart } = useCart();
  const { products, updateProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.address || !form.city || !form.zip) {
      addToast('Please fill in all fields', { type: 'error' });
      return;
    }

    // Update product sales for each item in cart
    cart.forEach((cartItem) => {
      const product = products.find((p) => p.id === cartItem.id);
      if (product) {
        const updatedSales = (product.sales || 0) + (cartItem.quantity || 1);
        updateProduct({
          ...product,
          sales: updatedSales,
        });
      }
    });

    // Create order record
    const order = {
      orderId: `ORD-${Date.now()}`,
      customer: form,
      items: cart,
      total: getTotal(),
      timestamp: new Date().toISOString(),
      location,
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem('brand-store-orders') || '[]');
    orders.push(order);
    localStorage.setItem('brand-store-orders', JSON.stringify(orders));

    // Clear cart and show success message
    clearCart();
    addToast(`Order placed successfully! Order ID: ${order.orderId}`, { type: 'success' });

    // Redirect to dashboard
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  if (cart.length === 0) return <div className="empty-cart"><p>Cart is empty. <Link to="/products">Shop now</Link></p></div>;

  return (
    <section className="checkout-page">
      <div className="checkout-grid">
        <div className="checkout-form">
          <h1>Checkout</h1>
          <form onSubmit={handleSubmit} className="form-card">
            <div className="form-row">
              <label>Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>

            <div className="form-row">
              <label>Address</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} required />
            </div>

            <div className="form-row two-cols">
              <div>
                <label>City</label>
                <input type="text" name="city" value={form.city} onChange={handleChange} required />
              </div>
              <div>
                <label>ZIP</label>
                <input type="text" name="zip" value={form.zip} onChange={handleChange} required />
              </div>
            </div>

            {location && <p className="muted">Detected location: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}</p>}

            <div className="form-actions">
              <Link to="/cart" className="btn-ghost">Back to Cart</Link>
              <button type="submit" className="btn-primary">Place Order — ₹{getTotal().toFixed(2)}</button>
            </div>
          </form>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>
          <ul className="summary-list">
            {cart.map(item => (
              <li key={item.id} className="summary-item">
                <img src={item.images?.[0] || ''} alt={item.name} />
                <div>
                  <div className="summary-name">{item.name}</div>
                  <div className="muted">{item.quantity} × ₹{item.price.toFixed(2)}</div>
                </div>
                <div className="summary-price">₹{(item.price * item.quantity).toFixed(2)}</div>
              </li>
            ))}
          </ul>
          <div className="summary-total">
            <span>Total</span>
            <strong>₹{getTotal().toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;