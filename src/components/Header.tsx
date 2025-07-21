import { Link } from 'react-router-dom';
import logoUrl from '../assets/logo.png';

export default function Header() {
  return (
  <header className="fixed top-0 left-0 w-full min-w-150 bg-[#1e1e1e] border-b-4 border-[#19a9a0] z-50 shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
      <Link to="/" className="text-white text-2xl font-bold tracking-wide">
        <img src={logoUrl} alt="Site Logo" className="h-8 inline-block mr-2 align-middle px-4" />
        Web Store
      </Link>

      <nav className="space-x-6 text-white font-medium">
        <Link to="/" className="hover:text-[#19a9a0]">Product Catalog</Link>
        <Link to="/order" className="hover:text-[#19a9a0]">Order</Link>
        <Link to="/admin" className="hover:text-[#19a9a0]">Admin</Link>
      </nav>
    </div>
  </header>
);

}
