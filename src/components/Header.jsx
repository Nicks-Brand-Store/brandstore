import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './HeaderFooter.css';
import logo from '../assets/nrandstore-logo-dark.svg';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const navigate = useNavigate();
  const { cart } = useCart();

  // Debounce the search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Navigate when debounced term changes
  useEffect(() => {
    if (debouncedTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(debouncedTerm)}`);
    }
  }, [debouncedTerm, navigate]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="app-header">
      <div className="container">
        <Link to="/" className="brand-title">
          <img src={logo} alt="Brand Store logo" className="brand-logo" />
        </Link>

        <nav className="header-nav">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>
        </nav>

        <form className="header-search" onSubmit={handleSearchSubmit}>
          <button type="submit" className="search-button" aria-label="Search products">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M10 18a8 8 0 1 1 5.293-2.707l4.707 4.707-1.414 1.414-4.707-4.707A7.963 7.963 0 0 1 10 18zm0-14a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
            </svg>
          </button>
          <input
            type="search"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <Link to="/cart" className="cart-link" aria-label="View cart">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M7 4h-2l-1 2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 8 17h12v-2H8.42a.25.25 0 0 1-.22-.13l.03-.06L9.1 13h7.45a1 1 0 0 0 .92-.62l3.24-7.26A1 1 0 0 0 20.7 4H6.21l-.94-2H1v2h2l3.6 7.59L5.21 14A1 1 0 0 0 6 16h12v2H6a3 3 0 0 1-2.82-4L7 4zm0 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
          <span className="cart-count">{cart.length}</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;