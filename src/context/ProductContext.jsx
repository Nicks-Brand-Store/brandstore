import { createContext, useContext, useEffect, useState } from 'react';
import { products as initialProducts } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forceReset = params.get('resetProducts') === '1';
      if (forceReset) {
        console.info('ProductContext: resetProducts=1 detected — clearing stored products');
        window.localStorage.removeItem('brand-store-products');
        return initialProducts;
      }

      const storedRaw = window.localStorage.getItem('brand-store-products');
      if (!storedRaw) return initialProducts;
      const stored = JSON.parse(storedRaw);
      // If stored products look like older shape (images missing or single), migrate images from initialProducts
      if (Array.isArray(stored) && stored.length) {
        const migrated = stored.map((sp) => {
          const ip = initialProducts.find((p) => p.id === sp.id);
          if (ip && Array.isArray(ip.images) && ip.images.length > 0) {
            const needsImageMigration =
              !sp.images ||
              !Array.isArray(sp.images) ||
              sp.images.length < 3 ||
              sp.images[0] !== ip.images[0];

            if (needsImageMigration) {
              return { ...sp, images: ip.images };
            }
          }
          return sp;
        });
        console.info('ProductContext: loaded', migrated.length, 'stored products; first images length=', migrated[0]?.images?.length);
        return migrated;
      }
      return initialProducts;
    } catch (e) {
      console.warn('Failed to parse stored products, falling back to defaults', e);
      return initialProducts;
    }
  });

  useEffect(() => {
    window.localStorage.setItem('brand-store-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      {
        ...product,
        id: Date.now(),
        images: product.images || [],
      },
    ]);
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === updatedProduct.id 
          ? { 
              ...product,
              ...updatedProduct,
              images: updatedProduct.images || product.images || [] 
            } 
          : product
      )
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const getProductById = (id) => products.find((product) => product.id === Number(id));

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProductById }}>
      {children}
    </ProductContext.Provider>
  );
}
