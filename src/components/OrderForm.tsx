// src/components/OrderForm.tsx
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCTS } from '../graphql/queries';
import { PLACE_MULTI_ORDER } from '../graphql/mutations';
import type { Product } from '../types/Product';
import { FaTrash } from 'react-icons/fa';


const PAGE_SIZE = 10;

const OrderForm = () => {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [orderedBy, setOrderedBy] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [formFilters, setFormFilters] = useState({
    titleContains: '',
    minPrice: '',
    maxPrice: '',
    sortField: 'title',
    sortDir: 'asc',
  });
  const [filters, setFilters] = useState(formFilters);
  const [productList, setProductList] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { data, fetchMore, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      first: PAGE_SIZE,
      after: null,
      filter: {
        titleContains: filters.titleContains || undefined,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      },
      sort: {
        field: filters.sortField,
        direction: filters.sortDir,
      },
    },
    onCompleted: (data) => {
      const fetched: Product[] = data?.products?.edges?.map((e: { node: Product }) => e.node) ?? [];
      setProductList(fetched);
      setEndCursor(data?.products?.pageInfo?.endCursor ?? null);
      setHasMore(data?.products?.pageInfo?.hasNextPage ?? false);
      setAllProducts((prev) => {
        const ids = new Set(prev.map((prod) => prod.id));
        return [...prev, ...fetched.filter((prod) => !ids.has(prod.id))];
      });
    },
    fetchPolicy: 'cache-and-network',
  });

  const [placeMultiOrder, { loading: placing, error: submitError }] = useMutation(PLACE_MULTI_ORDER);

  const applyFilters = async () => {
    setFilters(formFilters);
    const res = await refetch({
      first: PAGE_SIZE,
      after: null,
      filter: {
        titleContains: formFilters.titleContains || undefined,
        minPrice: formFilters.minPrice ? parseFloat(formFilters.minPrice) : undefined,
        maxPrice: formFilters.maxPrice ? parseFloat(formFilters.maxPrice) : undefined,
      },
      sort: {
        field: formFilters.sortField,
        direction: formFilters.sortDir,
      },
    });

    const newProducts: Product[] = res?.data?.products?.edges?.map((e: { node: Product }) => e.node) ?? [];
    setProductList(newProducts);
    setEndCursor(res?.data?.products?.pageInfo?.endCursor ?? null);
    setHasMore(res?.data?.products?.pageInfo?.hasNextPage ?? false);
  };

  const resetFilters = async () => {
    const defaults = {
      titleContains: '',
      minPrice: '',
      maxPrice: '',
      sortField: 'title',
      sortDir: 'asc',
    };
    setFormFilters(defaults);
    setFilters(defaults);
    const res = await refetch({
      first: PAGE_SIZE,
      after: null,
      filter: {},
      sort: { field: 'title', direction: 'asc' },
    });

    const newProducts: Product[] = res?.data?.products?.edges?.map((e: { node: Product }) => e.node) ?? [];
    setProductList(newProducts);
    setEndCursor(res?.data?.products?.pageInfo?.endCursor ?? null);
    setHasMore(res?.data?.products?.pageInfo?.hasNextPage ?? false);
  };

  const handleLoadMore = async () => {
    const res = await fetchMore({
      variables: {
        first: PAGE_SIZE,
        after: endCursor,
        filter: {
          titleContains: filters.titleContains || undefined,
          minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        },
        sort: {
          field: filters.sortField,
          direction: filters.sortDir,
        },
      },
    });

    const newProducts: Product[] = res?.data?.products?.edges?.map((e: { node: Product }) => e.node) ?? [];
    setProductList((prev) => [...prev, ...newProducts]);
    setEndCursor(res?.data?.products?.pageInfo?.endCursor ?? null);
    setHasMore(res?.data?.products?.pageInfo?.hasNextPage ?? false);
    setAllProducts((prev) => {
      const ids = new Set(prev.map((prod) => prod.id));
      return [...prev, ...newProducts.filter((prod) => !ids.has(prod.id))];
    });
  };

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  const handleRemoveProduct = (productId: number) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleClearCart = () => {
    setQuantities({});
  };

  const cart = allProducts
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

  const totalCost = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCount = data?.products?.totalCount ?? 0;

  return (
    <div className="flex pt-20 max-w-7xl mx-auto px-4">
      <aside className="w-82 fixed top-20 right-4 bg-white shadow-lg border rounded-lg p-4 z-10">
        <h3 className="font-semibold mb-2">Cart Summary</h3>
        {cart.length === 0 ? (
          <p className="text-gray-600">No products selected.</p>
        ) : (
          <div>
            <ul className="space-y-1 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.title} × {item.quantity}</span>
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    <button onClick={() => handleRemoveProduct(item.id)} className="remove-btn text-gray-600"><FaTrash className="w-4 h-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="font-semibold mb-4">Total: ${totalCost.toFixed(2)}</div>
            <button onClick={handleClearCart} className="remove-btn text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded">Clear Cart</button>
          </div>
        )}
        <div className="space-y-2">
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
          {submitError && <p className="text-red-600 text-sm">{submitError.message}</p>}
          {successMsg && <p className="text-green-700 text-sm">{successMsg}</p>}
        </div>
      </aside>

      <div className="flex-1 pr-80 space-y-6">
        <div className="sticky top-[64px] z-20 bg-white pt-2 pb-4">
          <h2 className="text-xl font-bold pl-2">Order Products</h2>

          {/* Filters */}
          <div className="bg-white p-4 rounded shadow space-y-2 sm:space-x-2 sm:space-y-0 sm:flex sm:items-end sticky top-[64px] z-20">
            <input
              className="border rounded px-2 py-1"
              placeholder="Title contains"
              value={formFilters.titleContains}
              onChange={e => setFormFilters({ ...formFilters, titleContains: e.target.value })}
            />
            <input
              className="border rounded px-2 py-1"
              type="number"
              placeholder="Min price"
              value={formFilters.minPrice}
              onChange={e => setFormFilters({ ...formFilters, minPrice: e.target.value })}
            />
            <input
              className="border rounded px-2 py-1"
              type="number"
              placeholder="Max price"
              value={formFilters.maxPrice}
              onChange={e => setFormFilters({ ...formFilters, maxPrice: e.target.value })}
            />
            <select
              className="border rounded px-2 py-1"
              value={formFilters.sortField}
              onChange={e => setFormFilters({ ...formFilters, sortField: e.target.value })}
            >
              <option value="title">Title</option>
              <option value="price">Price</option>
            </select>
            <select
              className="border rounded px-2 py-1"
              value={formFilters.sortDir}
              onChange={e => setFormFilters({ ...formFilters, sortDir: e.target.value })}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
            <button type="button" onClick={applyFilters} className="bg-blue-600 text-white px-3 py-1 rounded">
              Apply
            </button>
            <button type="button" onClick={resetFilters} className="bg-gray-400 text-white px-3 py-1 rounded">
              Reset
            </button>
          </div>

          <div className="text-sm text-gray-600 pt-2 pl-4">
            Showing <strong>{productList.length}</strong> of <strong>{totalCount}</strong> products
          </div>
      </div>

        <ul className="space-y-2">
          {productList.map((p: Product) => (
            <li key={p.id} className="border p-2 bg-white rounded shadow">
              <div className="flex justify-between items-center">
                <span>
                  {p.title} [ID: {p.id}] – ${p.price} ({p.stock} in stock)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Order amount:</span>
                  <input
                    type="number"
                    min={0}
                    max={p.stock}
                    value={quantities[p.id] || 0}
                    onChange={(e) => handleQuantityChange(p.id, Number(e.target.value))}
                    className="w-16 border px-2 py-1 rounded"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>

        {hasMore && (
          <div className="flex justify-center pt-4">
            <button onClick={handleLoadMore} className="bg-blue-600 text-white px-4 py-2 rounded">
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderForm;
