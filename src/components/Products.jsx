import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import fallbackImage from '../assets/Tshirt.webp';

function Products() {
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const filtered = products.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    // Reset to first page when filters/search change
    setPage(1);
  }, [category, searchQuery, products]);

  const currentProducts = filtered.slice((page - 1) * perPage, page * perPage);

  const categories = ['All', ...new Set(products.map((p) => p.category || 'Misc'))];

  return (
    <section>
      <h1>Products</h1>

      <div className="products-filters">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        {searchQuery && <p>Showing results for: "{searchQuery}"</p>}
      </div>

      <div className="product-grid">
        {currentProducts.map((product) => (
          <div key={product.id} className="product-card">
            <img
              src={product.images?.[0] || fallbackImage}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallbackImage;
              }}
            />
            <h2>{product.name}</h2>
            <p>₹{product.price}</p>

            <div className="card-actions">
              <Link to={`/product/${product.id}`} className="details">View Details</Link>

              <button
                type="button"
                className="add-cart-btn"
                aria-label={`Add ${product.name} to cart`}
                onClick={() => { addToCart(product); addToast(`Added ${product.name} to cart`); }}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="20" r="1.5" fill="#fff" />
                  <circle cx="18" cy="20" r="1.5" fill="#fff" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && <p>No products found.</p>}

      {filtered.length > perPage && (
        <div className="pagination">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={pageNumber}
                className={pageNumber === page ? 'active' : ''}
                onClick={() => setPage(pageNumber)}
                type="button"
              >
                {pageNumber}
              </button>
            );
          })}

          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default Products;