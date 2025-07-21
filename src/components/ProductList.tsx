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
  <div className="mx-auto px-4 mt-4 space-y-6 ">
    <div className="sticky top-[64px] z-20 mx-auto bg-white pb-4 pt-2 w-fit">
      <h2 className="text-xl pl-4 font-bold">Product Catalog</h2>
      <form className="bg-white p-4 rounded shadow space-y-2 sm:space-x-2 sm:space-y-0 sm:flex sm:items-end">
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
    </form>

      <div className="text-sm text-gray-600 pt-2 pl-4">
        Showing <strong>{productList.length}</strong> of <strong>{totalCount}</strong> products
      </div>
    </div>

    <div className="flex justify-center">
    <ul className="divide-y border-t">
      {productList.map(p => (
        <li key={p.id} className="py-2 px-4">
          {p.title} – ${p.price} – {p.stock} in stock
        </li>
      ))}
    </ul>
    </div>

    {hasMore && (
      <div className="flex justify-center pt-4">
        <button onClick={handleLoadMore} className="bg-blue-600 text-white px-4 py-2 rounded">
          Load More
        </button>
      </div>
    )}
    
  </div>
);

};

export default ProductList;
