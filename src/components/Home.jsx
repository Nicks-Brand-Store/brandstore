import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

import tshirt from '../assets/tshirt.webp';
import oipImage from '../assets/oip.webp';

function Home() {
  const [page, setPage] = useState(1);

  const allProducts = Array.from({ length: 50 }, (_, index) => {
    const product = products[index % products.length];
    return {
      ...product,
      uniqueId: `${product.id}-${index}`,
    };
  });

  const perPage = 12;
  const totalPages = Math.ceil(allProducts.length / perPage);
  const currentProducts = allProducts.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <section>
      <h2>Featured Products</h2>

      <div className="product-grid">
        {currentProducts.map((product, index) => {
          const imageUrl = index % 2 === 0 ? tshirt : oipImage;

          return (
            <div key={product.uniqueId} className="product-card">
              <img src={imageUrl} alt={`Image of ${product.name}`} />
              <h3>{product.name}</h3>
              <p>₹{product.price}</p>
              <Link to={`/product/${product.id}`}>View Details</Link>
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