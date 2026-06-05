import tshirt from '../assets/Tshirt.webp';
import classicT from '../assets/classic-T-shirt.jfif';
import denim from '../assets/Denimjeans.jfif';
import leather from '../assets/Leatherjacket.jfif';
import perfume from '../assets/Perfume.jfif';
import running from '../assets/Runnigshoes.jfif';
import sandalsImg from '../assets/Sandals.jfif';
import sneakersImg from '../assets/Sneakers.jfif';
import sunglass from '../assets/Sunglass.jfif';
import cap from '../assets/Baseballcap.jfif';
import watch from '../assets/WATCH.jfif';
import oip from '../assets/OIP.webp';

// Generate 50 fake products by expanding a small set of base items.
const base = [
  {
    name: 'Classic T-Shirt',
    category: 'Clothes',
    price: 19.99,
    description: 'Comfortable cotton t-shirt available in multiple colors.',
    images: [classicT],
  },
  {
    name: 'Running Shoes',
    category: 'Shoes',
    price: 89.99,
    description: 'Lightweight running shoes with excellent cushioning.',
    images: [running],
  },
  {
    name: 'Denim Jeans',
    category: 'Clothes',
    price: 49.99,
    description: 'Stylish denim jeans for everyday wear.',
    images: [denim],
  },
  {
    name: 'Sneakers',
    category: 'Shoes',
    price: 69.99,
    description: 'Casual sneakers perfect for urban style.',
    images: [sneakersImg],
  },
  {
    name: 'Leather Jacket',
    category: 'Clothes',
    price: 129.99,
    description: 'Premium leather jacket for a bold look.',
    images: [leather],
  },
  {
    name: 'Sandals',
    category: 'Shoes',
    price: 29.99,
    description: 'Comfortable sandals for summer days.',
    images: [sandalsImg],
  },
  {
    name: 'Baseball Cap',
    category: 'Accessories',
    price: 14.99,
    description: 'Adjustable baseball cap with logo.',
    images: [cap],
  },
  {
    name: 'Sunglasses',
    category: 'Accessories',
    price: 39.99,
    description: 'UV-protective sunglasses with stylish design.',
    images: [sunglass],
  },
  {
    name: 'Watch',
    category: 'Accessories',
    price: 149.99,
    description: 'Stylish watch to complete your outfit.',
    images: [watch],
  },
  {
    name: 'Perfume',
    category: 'Perfume',
    price: 39.99,
    description: 'Luxury fragrance with a refreshing scent.',
    images: [perfume],
  },
];

// All available images for smart distribution
const allImages = [tshirt, classicT, denim, leather, running, sneakersImg, sandalsImg, cap, sunglass, watch, perfume, oip];

const categoryAssets = {
  Clothes: [tshirt, classicT, denim, leather],
  Shoes: [running, sneakersImg, sandalsImg],
  Accessories: [cap, sunglass, watch],
  Perfume: [perfume],
  Default: allImages,
};

function chooseImageFor(i, category) {
  // First try to get images from the category for relevance
  const categoryArr = categoryAssets[category];
  if (categoryArr && categoryArr.length >= 3) {
    const start = i % categoryArr.length;
    return [
      categoryArr[start],
      categoryArr[(start + 1) % categoryArr.length],
      categoryArr[(start + 2) % categoryArr.length],
    ];
  }
  // For categories with fewer than 3 images, spread across all assets for variety
  const startIdx = (i * 7 + (i % 12)) % allImages.length;
  return [
    allImages[startIdx % allImages.length],
    allImages[(startIdx + 3) % allImages.length],
    allImages[(startIdx + 7) % allImages.length],
  ];
}

function deterministic(i, mod, offset = 0) {
  return ((i * 97 + 13) % mod) + offset;
}

export const products = Array.from({ length: 50 }, (_, idx) => {
  const i = idx + 1;
  const b = base[idx % base.length];
  const variant = Math.floor(idx / base.length) + 1;
  const priceFluct = 1 + ((idx % 7) - 3) / 20; // small variation
  const price = Math.max(5, +(b.price * priceFluct).toFixed(2));
  const sales = deterministic(i, 500, 5);
  const views = deterministic(i, 3000, 20);
  const rating = +( (3 + (i % 20) / 10).toFixed(1) );

  return {
    id: i,
    name: b.name,
    category: b.category,
    price,
    images: b.images ? b.images : chooseImageFor(i, b.category),
    description: b.description,
    sales,
    views,
    rating,
  };
});
 