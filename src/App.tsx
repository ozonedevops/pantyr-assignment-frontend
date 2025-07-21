import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ProductList from './components/ProductList';
import AdminPanel from './components/AdminPanel';
import OrderForm from './components/OrderForm';
import Header from './components/Header';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen w-full bg-gray-100 text-gray-900">
        <Header />
        <main className="mx-auto px-4 pt-20 space-y-6">
          <Routes>
            <Route path="/" element={<OrderForm />} />
            <Route path="/order" element={<OrderForm />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;

