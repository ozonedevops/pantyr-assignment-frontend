import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import OrderForm from './components/OrderForm';

const App = () => {
  return (
    <Router>
      <div className="p-4 space-y-6">
        {/* Navbar */}
        <nav className="space-x-4 border-b pb-2">
          <Link to="/" className="text-blue-600 hover:underline">Product Catalog</Link>
          <Link to="/order">Order</Link>
          <Link to="/admin" className="text-blue-600 hover:underline">Admin</Link>
        </nav>

        {/* Page content */}
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
