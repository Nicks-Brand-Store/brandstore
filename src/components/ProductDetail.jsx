import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import fallbackImage from '../assets/Tshirt.webp';

function ProductDetail() {
  const { id } = useParams();
  const { getProductById } = useProducts();
  const product = getProductById(id);
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(product?.images?.[0] || fallbackImage);

  if (!product) return <div>Product not found</div>;

  const images = product.images?.length ? product.images : [fallbackImage];

  return (
    <div className="product-detail-page">
      <header className="product-detail-header">
        <h1>{product.name}</h1>
        <nav>
          <Link to="/products">Back to Products</Link> | <Link to="/cart">Cart</Link>
        </nav>
      </header>
      <main className="product-detail-layout">
        <section className="product-detail-gallery">
          <img
            className="product-detail-main-image"
            src={selected}
            alt={`Selected view of ${product.name}`}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
          <div className="product-gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`thumb-button ${selected === img ? 'active' : ''}`}
                onClick={() => setSelected(img || fallbackImage)}
              >
                <img
                  src={img || fallbackImage}
                  alt={`${product.name} ${i + 1}`}
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
              </button>
            ))}
          </div>
        </section>
        <section className="product-detail-info">
          <p>{product.description}</p>
          <p className="detail-price">Price: ₹{product.price}</p>
          <button type="button" className="add-cart-btn full-width" onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </section>
      </main>
    </div>
  );
}

export default ProductDetail;