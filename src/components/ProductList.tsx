import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_PRODUCTS } from '../graphql/queries';
import type { Product } from '../types/Product';

const PAGE_SIZE = 10;

const ProductList = () => {
  const [formFilters, setFormFilters] = useState({
    titleContains: '',
    minPrice: '',
    maxPrice: '',
    sortField: 'title',
    sortDir: 'asc',
  });

  const [filters, setFilters] = useState(formFilters);
  const [productList, setProductList] = useState<Product[]>([]);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS, {
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
      const newProducts = data?.products?.edges?.map((e: any) => e.node) ?? [];
      setProductList(newProducts);
      setEndCursor(data?.products?.pageInfo?.endCursor ?? null);
      setHasMore(data?.products?.pageInfo?.hasNextPage ?? false);
    },
    fetchPolicy: 'cache-and-network',
  });

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

    const newProducts = res?.data?.products?.edges?.map((e: any) => e.node) ?? [];
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

    const newProducts = res?.data?.products?.edges?.map((e: any) => e.node) ?? [];
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

    const newProducts = res?.data?.products?.edges?.map((e: any) => e.node) ?? [];
    setProductList(prev => [...prev, ...newProducts]);
    setEndCursor(res?.data?.products?.pageInfo?.endCursor ?? null);
    setHasMore(res?.data?.products?.pageInfo?.hasNextPage ?? false);
  };

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const totalCount = data?.products?.totalCount ?? 0;

  return (
    <div className="mt-4 space-y-6">
      <h2 className="text-xl font-bold">Product Catalog</h2>

      <form className="space-x-2">
        <input
          placeholder="Title contains"
          value={formFilters.titleContains}
          onChange={e => setFormFilters({ ...formFilters, titleContains: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min price"
          value={formFilters.minPrice}
          onChange={e => setFormFilters({ ...formFilters, minPrice: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max price"
          value={formFilters.maxPrice}
          onChange={e => setFormFilters({ ...formFilters, maxPrice: e.target.value })}
        />
        <select
          value={formFilters.sortField}
          onChange={e => setFormFilters({ ...formFilters, sortField: e.target.value })}
        >
          <option value="title">Title</option>
          <option value="price">Price</option>
        </select>
        <select
          value={formFilters.sortDir}
          onChange={e => setFormFilters({ ...formFilters, sortDir: e.target.value })}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        <button type="button" onClick={applyFilters} className="bg-blue-500 text-white px-2 py-1">
          Apply Filters
        </button>
        <button type="button" onClick={resetFilters} className="bg-gray-300 px-2 py-1">
          Reset Filters
        </button>
      </form>

      <div className="text-sm text-gray-600">
        Showing <strong>{productList.length}</strong> of <strong>{totalCount}</strong> products
      </div>

      <ul className="border-t divide-y">
        {productList.map(p => (
          <li key={p.id} className="py-2">
            {p.title} – ${p.price} – {p.stock} in stock
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="pt-4">
          <button onClick={handleLoadMore} className="bg-blue-600 text-white px-4 py-2">
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
