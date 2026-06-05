import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import fallbackImage from '../assets/Tshirt.webp';

function Home() {
  const [page, setPage] = useState(1);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const allProducts = products.length
    ? Array.from({ length: 50 }, (_, index) => {
        const product = products[index % products.length];
        return {
          ...product,
          uniqueId: `${product.id}-${index}`,
        };
      })
    : [];

  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(allProducts.length / perPage));
  const currentProducts = allProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <section>
      <h2>Featured Products</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Featured</h3>
        {/* <button type="button" onClick={() => { localStorage.removeItem('brand-store-products'); location.reload(); }} style={{ background: '#eee', border: '1px solid #ccc', padding: '6px 10px', borderRadius: 6 }}>
          Reset sample data
        </button> */}
      </div>

      <div className="product-grid">
        {currentProducts.map((product) => {
          const imageUrl = (product.images && product.images.length && product.images[0]) || fallbackImage;

          return (
            <div key={product.uniqueId} className="product-card">
              <img
                src={imageUrl}
                alt={`Image of ${product.name}`}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
              <h3>{product.name}</h3>
              <p className="product-category">{product.category}</p>
              <p className="product-price">₹{product.price}</p>
              <p className="product-description">{product.description}</p>
              <button
                type="button"
                className="add-cart-btn full-width"
                aria-label={`Add ${product.name} to cart`}
                onClick={() => {
                  addToCart(product);
                  addToast(`Added ${product.name} to cart`);
                }}
              >
                Add to cart
              </button>
              <Link to={`/product/${product.id}`} className="details full-width">
                View details
              </Link>
            </div>
          );
        })}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => {
          const pageNumber = index + 1;
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
      </div>
    </section>
  );
}

export default Home;