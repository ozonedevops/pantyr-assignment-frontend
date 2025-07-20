import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCTS } from '../graphql/queries';
import { PLACE_ORDER } from '../graphql/mutations';
import type { Product } from '../types/Product';

const OrderForm = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [orderedBy, setOrderedBy] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [placeOrder, { loading: placing, error }] = useMutation(PLACE_ORDER);

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

    const productIds = cart.flatMap((p) => Array(p.quantity).fill(p.id));

    try {
      await placeOrder({
        variables: {
          orderedBy,
          products: productIds,
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
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Place an Order</h2>

      {loading && <p>Loading products…</p>}

      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id} className="border p-2">
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

      <div className="pt-4">
        <h3 className="font-semibold">Cart Summary</h3>
        {cart.length === 0 ? (
          <p>No products selected.</p>
        ) : (
          <ul className="space-y-1">
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2 pt-4">
        <input
          type="text"
          placeholder="Your name or email"
          value={orderedBy}
          onChange={(e) => setOrderedBy(e.target.value)}
          className="border px-2 py-1 w-full"
        />
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 disabled:opacity-50"
          disabled={placing || cart.length === 0}
        >
          {placing ? 'Placing Order...' : 'Submit Order'}
        </button>
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {successMsg && <p className="text-green-700">{successMsg}</p>}
      </div>
    </div>
  );
};

export default OrderForm;
