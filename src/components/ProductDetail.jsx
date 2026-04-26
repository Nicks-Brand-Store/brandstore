import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(null);

  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <header>
        <h1>{product.name}</h1>
        <nav>
          <Link to="/products">Back to Products</Link> | <Link to="/cart">Cart</Link>
        </nav>
      </header>
      <main>
        <div style={{ display: 'flex' }}>
          <div>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt={`${product.name} ${i+1}`} style={{ width: '100px', cursor: 'pointer' }} onClick={() => setSelected(img)} />
            ))}
          </div>
          <div>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        </div>
        {selected && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setSelected(null)}>
            <img src={selected} alt="Selected" style={{ maxWidth: '80%', maxHeight: '80%' }} />
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetail;