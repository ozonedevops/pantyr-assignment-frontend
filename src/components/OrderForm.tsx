import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCTS } from '../graphql/queries';
import { PLACE_MULTI_ORDER } from '../graphql/mutations';
import type { Product } from '../types/Product';

const OrderForm = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [orderedBy, setOrderedBy] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [placeMultiOrder, { loading: placing, error }] = useMutation(PLACE_MULTI_ORDER);

  const { data, loading } = useQuery(GET_PRODUCTS, {
    variables: {
      first: 1000,
      after: null,
      filter: {},
      sort: { field: 'title', direction: 'asc' },
    },
  });

  const products: Product[] = data?.products?.edges?.map((e: any) => e.node) ?? [];

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const cart = products
    .filter((p) => quantities[p.id] && quantities[p.id] > 0)
    .map((p) => ({
      ...p,
      quantity: quantities[p.id],
    }));

  const handleSubmit = async () => {
    if (!orderedBy.trim()) {
      alert('Please enter your name or email');
      return;
    }

    const orderItems = cart.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
    }));

    try {
      await placeMultiOrder({
        variables: {
          orderedBy,
          products: orderItems,
        },
      });
      setSuccessMsg('Order placed successfully!');
      setQuantities({});
      setOrderedBy('');
    } catch (err) {
      console.error('Order failed', err);
    }
  };

return (
  <div className="flex pt-20 max-w-7xl mx-auto px-4">
    {/* Right: Fixed cart summary */}
    <aside className="w-70 fixed top-20 right-4 bg-white shadow-lg border rounded-lg p-4 z-10">
    {/* <div className="fixed top-20 right-4 bg-white shadow-lg rounded p-4 w-80 z-50"> */}
      <h3 className="font-semibold mb-2">Cart Summary</h3>
      {loading && <p>Loading products…</p>}
      {cart.length === 0 ? (
        <p className="text-gray-600">No products selected.</p>
      ) : (
        <ul className="space-y-1">
          {cart.map((item) => (
            <li key={item.id}>
              {item.title} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 space-y-2">
        <input
          type="text"
          placeholder="Your name or email"
          value={orderedBy}
          onChange={(e) => setOrderedBy(e.target.value)}
          className="border px-2 py-1 w-full rounded"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 w-full rounded disabled:opacity-50"
          disabled={placing || cart.length === 0}
        >
          {placing ? 'Placing Order…' : 'Submit Order'}
        </button>
      </div>
      {error && <p className="text-red-600 mt-2">Error: {error.message}</p>}
      {successMsg && <p className="text-green-700 mt-2">{successMsg}</p>}
    {/* </div> */}
    </aside>
    
    
    {/* Scrollable product form left from cart summary */}
    <div className="flex-1 pr-72 space-y-6">
      {/* <h1 className="font-semibold mb-2">Place an order</h1> */}
    <ul className="max-w-4xl space-y-2 pt-4">
      {products.map((p) => (
        <li key={p.id} className="border p-2 bg-white rounded shadow">
          <div className="flex justify-between items-center">
            <span>
              {p.title} – ${p.price} ({p.stock} in stock)
            </span>
            <input
              type="number"
              min={0}
              max={p.stock}
              value={quantities[p.id] || 0}
              onChange={(e) => handleQuantityChange(p.id, Number(e.target.value))}
              className="w-16 border px-2"
            />
          </div>
        </li>
      ))}
    </ul>
    </div>
  </div>
);


};

export default OrderForm;
