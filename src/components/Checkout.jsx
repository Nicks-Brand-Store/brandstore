import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Checkout() {
  const { cart, getTotal } = useCart();
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
    alert('Order placed! (This is a demo)');
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