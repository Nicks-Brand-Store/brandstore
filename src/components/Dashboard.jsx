import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductAnalytics from './ProductAnalytics';
import fallbackImage from '../assets/Tshirt.webp';

const emptyForm = {
  name: '',
  category: '',
  price: '',
  images: '',
  description: '',
};

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [adminView, setAdminView] = useState('products');
  const [custPage, setCustPage] = useState(1);
  const custPerPage = 8;
  const custTotalPages = Math.max(1, Math.ceil(products.length / custPerPage));
  const navigate = useNavigate();

  useEffect(() => {
    setCustPage(1);
  }, [products]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const parsedPrice = Number(form.price);
    if (!form.name || !form.category || !form.description || Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      addToast('Please complete the form with a valid price.', { type: 'error' });
      return;
    }

    const payload = {
      name: form.name,
      category: form.category,
      price: parsedPrice,
      description: form.description,
      images: form.images
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (editingId) {
      updateProduct({ ...payload, id: editingId });
      addToast('Product updated successfully.', { type: 'success' });
    } else {
      addProduct(payload);
      addToast('Product added successfully.', { type: 'success' });
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      images: product.images?.join(', ') || '',
      description: product.description,
    });
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    addToast('Product deleted successfully.', { type: 'success' });
  };

  return (
    <section className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="muted">Logged in as</p>
          <h1>{user?.username || 'Guest'}</h1>
          <p>{isAdmin ? 'Admin dashboard for product management.' : 'Customer dashboard with quick product overview.'}</p>
        </div>
      </header>

      {isAdmin ? (
        <>
          <div className="admin-tabs">
            <button
              className={`tab-button ${adminView === 'products' ? 'active' : ''}`}
              onClick={() => setAdminView('products')}
            >
              📦 Product Management
            </button>
            <button
              className={`tab-button ${adminView === 'analytics' ? 'active' : ''}`}
              onClick={() => setAdminView('analytics')}
            >
              📊 Analytics & Reports
            </button>
          </div>

          {adminView === 'products' ? (
            <div className="dashboard-grid">
              <div className="dashboard-panel">
                <h2>{editingId ? 'Edit product' : 'Add new product'}</h2>
                <form className="dashboard-form" onSubmit={handleSubmit}>
                  <label>
                    Name
                    <input
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Category
                    <input
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Price
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      required
                      min="0"
                      step="0.01"
                    />
                  </label>

                  <label>
                    Image URLs (comma separated)
                    <input
                      value={form.images}
                      onChange={(e) => handleChange('images', e.target.value)}
                      placeholder="https://... , https://..."
                    />
                  </label>

                  <label>
                    Description
                    <textarea
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                    />
                  </label>

                  <div className="dashboard-actions">
                    <button type="submit" className="btn-primary">
                      {editingId ? 'Update product' : 'Add product'}
                    </button>
                    {editingId && (
                      <button type="button" className="btn-ghost" onClick={resetForm}>
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              <div className="dashboard-panel">
                <h2>Managed products</h2>
                <div className="dashboard-table">
                  {products.map((product) => (
                    <div key={product.id} className="dashboard-row">
                      <div>
                        <strong>{product.name}</strong>
                        <div className="muted">{product.category} · ₹{product.price}</div>
                      </div>
                      <div className="dashboard-row-actions">
                        <button type="button" onClick={() => handleEdit(product)}>
                          Edit
                        </button>
                        <button type="button" className="btn-danger" onClick={() => handleDelete(product.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <ProductAnalytics products={products} />
          )}
        </>
      ) : (
        <div className="customer-dashboard">
          <div className="dashboard-panel customer-intro">
            <div>
              <h2>Welcome back, {user?.username}</h2>
              <p>Browse top products below or head straight to the shop to add items to your cart.</p>
            </div>
            <div className="customer-actions">
              <button type="button" className="btn-primary" onClick={() => navigate('/products')}>
                Shop all products
              </button>
              <button type="button" className="btn-ghost" onClick={() => navigate('/cart')}>
                View cart
              </button>
            </div>
          </div>

          <div className="customer-products">
            <div className="section-header">
              <h3>Recommended for you</h3>
              <p>Quick access to the freshest product picks from the catalog.</p>
            </div>
            <div className="dashboard-product-grid">
              {products.slice((custPage - 1) * custPerPage, custPage * custPerPage).map((product) => (
                <article key={product.id} className="dashboard-card">
                  <img
                    src={product.images?.[0] || fallbackImage}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = fallbackImage;
                    }}
                  />
                  <div className="dashboard-card-body">
                    <div>
                      <h3>{product.name}</h3>
                      <p className="muted">{product.category}</p>
                    </div>
                    <p className="price">₹{product.price}</p>
                    <p className="dashboard-card-copy">{product.description}</p>
                    <div className="dashboard-card-actions">
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          addToCart(product);
                          addToast(`${product.name} added to cart`, { type: 'success' });
                        }}
                      >
                        Add to cart
                      </button>
                      <button type="button" className="btn-ghost" onClick={() => navigate(`/product/${product.id}`)}>
                        View details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
              {products.length > custPerPage && (
                <div className="pagination" style={{ marginTop: '1rem' }}>
                  <button type="button" onClick={() => setCustPage((p) => Math.max(1, p - 1))} disabled={custPage === 1}>
                    Prev
                  </button>
                  {Array.from({ length: custTotalPages }, (_, i) => {
                    const pageNumber = i + 1;
                    return (
                      <button
                        key={pageNumber}
                        className={pageNumber === custPage ? 'active' : ''}
                        onClick={() => setCustPage(pageNumber)}
                        type="button"
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                  <button type="button" onClick={() => setCustPage((p) => Math.min(custTotalPages, p + 1))} disabled={custPage === custTotalPages}>
                    Next
                  </button>
                </div>
              )}
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;
