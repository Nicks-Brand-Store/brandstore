import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

function ProductAnalytics({ products }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('sales');
  const [viewType, setViewType] = useState('charts');

  // Read persisted orders from localStorage (orders are created on Checkout)
  const orders = JSON.parse(localStorage.getItem('brand-store-orders') || '[]');

  // Aggregate orders per product (quantity and revenue)
  const orderAggregates = useMemo(() => {
    const agg = {};
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const id = item.id;
        if (!agg[id]) {
          // try to get meta from products list
          const proto = products.find((p) => p.id === id) || {};
          agg[id] = {
            id,
            name: item.name || proto.name || `Product ${id}`,
            category: item.category || proto.category || 'Unknown',
            price: item.price || proto.price || 0,
            sales: 0,
            revenue: 0,
            views: proto.views || 0,
            rating: proto.rating || 0,
          };
        }
        const qty = Number(item.quantity || 1);
        const price = Number(item.price || 0);
        agg[id].sales += qty;
        agg[id].revenue += qty * price;
      });
    });
    return agg;
  }, [orders, products]);

  const hasOrders = Array.isArray(orders) && orders.length > 0;

  // Build filtered list: if orders exist, prefer aggregated order metrics, otherwise fallback to products
  const filteredProducts = useMemo(() => {
    // base list: if we have orders use aggregated objects, else use products
    let list = [];
    if (hasOrders) {
      list = Object.values(orderAggregates).map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
        price: a.price,
        sales: a.sales,
        views: a.views || 0,
        rating: a.rating || 0,
      }));
    } else {
      list = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        sales: p.sales || 0,
        views: p.views || 0,
        rating: p.rating || 0,
      }));
    }

    // search filter
    list = list.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // sort
    if (sortBy === 'sales') list.sort((a, b) => b.sales - a.sales);
    else if (sortBy === 'popularity') list.sort((a, b) => b.views - a.views);
    else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'revenue') list.sort((a, b) => b.sales * b.price - a.sales * a.price);

    return list;
  }, [products, orderAggregates, hasOrders, searchTerm, sortBy]);

  // Chart data: top 8 entries
  const chartData = filteredProducts.slice(0, 8).map((p) => ({
    name: p.name.substring(0, 10),
    sales: p.sales || 0,
    views: p.views || 0,
    revenue: Math.round((p.sales || 0) * (p.price || 0)),
    rating: p.rating || 0,
    fullName: p.name,
  }));

  // category aggregation: prefer order aggregates when available
  const categoryData = useMemo(() => {
    const categories = {};
    if (hasOrders) {
      Object.values(orderAggregates).forEach((a) => {
        if (!categories[a.category]) categories[a.category] = { name: a.category, sales: 0, views: 0 };
        categories[a.category].sales += a.sales;
        categories[a.category].views += a.views || 0;
      });
    } else {
      products.forEach((p) => {
        if (!categories[p.category]) categories[p.category] = { name: p.category, sales: 0, views: 0 };
        categories[p.category].sales += p.sales || 0;
        categories[p.category].views += p.views || 0;
      });
    }
    return Object.values(categories);
  }, [products, orderAggregates, hasOrders]);

  const totalStats = useMemo(() => {
    if (hasOrders) {
      const totalSales = Object.values(orderAggregates).reduce((s, a) => s + (a.sales || 0), 0);
      const totalRevenue = Math.round(Object.values(orderAggregates).reduce((s, a) => s + (a.revenue || 0), 0));
      const totalViews = products.reduce((s, p) => s + (p.views || 0), 0);
      const avgRating = products.length ? (products.reduce((s, p) => s + (p.rating || 0), 0) / products.length).toFixed(1) : '0.0';
      return { totalSales, totalViews, totalRevenue, avgRating };
    }
    return {
      totalSales: products.reduce((sum, p) => sum + (p.sales || 0), 0),
      totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0),
      totalRevenue: Math.round(products.reduce((sum, p) => sum + ((p.sales || 0) * (p.price || 0)), 0)),
      avgRating: products.length ? (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1) : '0.0',
    };
  }, [products, orderAggregates, hasOrders]);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Product Analytics & Reports</h2>
        <div className="analytics-controls">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="sales">Sort by Sales</option>
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
            <option value="revenue">Sort by Revenue</option>
          </select>
          <select value={viewType} onChange={(e) => setViewType(e.target.value)} className="view-select">
            <option value="charts">Charts View</option>
            <option value="records">Records View</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon sales-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Sales</p>
            <p className="stat-value">{totalStats.totalSales.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon views-icon">👁️</div>
          <div className="stat-content">
            <p className="stat-label">Total Views</p>
            <p className="stat-value">{totalStats.totalViews.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <p className="stat-value">₹{totalStats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon rating-icon">⭐</div>
          <div className="stat-content">
            <p className="stat-label">Avg Rating</p>
            <p className="stat-value">{totalStats.avgRating}</p>
          </div>
        </div>
      </div>

      {viewType === 'charts' ? (
        <div className="charts-grid">
          {/* Sales Bar Chart */}
          <div className="chart-container">
            <h3>Product Sales</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="custom-tooltip">
                        <p className="tooltip-label">{payload[0].payload.fullName}</p>
                        <p className="tooltip-value">Sales: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="sales" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Views Line Chart */}
          <div className="chart-container">
            <h3>Product Views Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="custom-tooltip">
                        <p className="tooltip-label">{payload[0].payload.fullName}</p>
                        <p className="tooltip-value">Views: {payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Line type="monotone" dataKey="views" stroke="#10b981" dot />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Bar Chart */}
          <div className="chart-container">
            <h3>Product Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="custom-tooltip">
                        <p className="tooltip-label">{payload[0].payload.fullName}</p>
                        <p className="tooltip-value">Revenue: ₹{payload[0].value}</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="revenue" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Sales Pie Chart */}
          <div className="chart-container">
            <h3>Sales by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, sales }) => `${name}: ${sales}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category Views Pie Chart */}
          <div className="chart-container">
            <h3>Views by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, views }) => `${name}: ${views}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="views"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Rating Chart */}
          <div className="chart-container">
            <h3>Product Ratings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    return (
                      <div className="custom-tooltip">
                        <p className="tooltip-label">{payload[0].payload.fullName}</p>
                        <p className="tooltip-value">Rating: {payload[0].value} ⭐</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="rating" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="records-container">
          <h3>Product Records ({filteredProducts.length})</h3>
          <div className="records-table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Sales</th>
                  <th>Views</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                  <th>Conversion %</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const conversionRate = product.views > 0 ? ((product.sales / product.views) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={product.id}>
                      <td className="product-name">{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price.toFixed(2)}</td>
                      <td className="metric-sales">{product.sales}</td>
                      <td className="metric-views">{product.views}</td>
                      <td className="metric-revenue">₹{(product.sales * product.price).toLocaleString()}</td>
                      <td className="metric-rating">{product.rating} ⭐</td>
                      <td className="metric-conversion">{conversionRate}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductAnalytics;
