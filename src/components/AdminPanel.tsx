import { useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_PRODUCT,
  UPDATE_PRODUCT_PRICE,
  UPDATE_PRODUCT_STOCK,
} from '../graphql/queries';

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [updateId, setUpdateId] = useState(0);

  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updatePrice] = useMutation(UPDATE_PRODUCT_PRICE);
  const [updateStock] = useMutation(UPDATE_PRODUCT_STOCK);

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 space-y-10">
      <h2 className="text-2xl font-bold text-center">Admin Panel</h2>

      <div className="space-y-8">
        {/* Add Product */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Add New Product</h3>
          <div className="grid gap-4">
            <p>Product Title:</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Product Title"
              className="border px-3 py-2 rounded w-full"
            />
            <p>Price:</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="Price"
              className="border px-3 py-2 rounded w-full"
            />
            <p>Stock:</p>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="Stock"
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={() =>
                addProduct({
                  variables: { input: { title, price, stock } },
                })
              }
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>

        {/* Update Price */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Update Product Price</h3>
          <div className="grid gap-4">
            <p>Product ID:</p>
            <input
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(parseInt(e.target.value))}
              placeholder="Product ID"
              className="border px-3 py-2 rounded w-full"
            />
            <p>New Price:</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              placeholder="New Price"
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={() =>
                updatePrice({ variables: { productId: updateId, price } })
              }
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Price
            </button>
          </div>
        </div>

        {/* Update Stock */}
        <div className="border rounded-lg p-6 bg-white shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Update Product Stock</h3>
          <div className="grid gap-4">
            <p>Procuct ID:</p>
            <input
              type="number"
              value={updateId}
              onChange={(e) => setUpdateId(parseInt(e.target.value))}
              placeholder="Product ID"
              className="border px-3 py-2 rounded w-full"
            />
            <p>New Stock:</p>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="New Stock"
              className="border px-3 py-2 rounded w-full"
            />
            <button
              onClick={() =>
                updateStock({ variables: { productId: updateId, stock } })
              }
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
