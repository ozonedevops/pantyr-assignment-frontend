import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_PRODUCT, UPDATE_PRODUCT_PRICE, UPDATE_PRODUCT_STOCK } from '../graphql/queries';

const AdminPanel = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [updateId, setUpdateId] = useState(0);

  const [addProduct] = useMutation(ADD_PRODUCT);
  const [updatePrice] = useMutation(UPDATE_PRODUCT_PRICE);
  const [updateStock] = useMutation(UPDATE_PRODUCT_STOCK);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold">Admin Panel</h2>

      <div className="space-y-4">
        <div>
          <h3>Add Product</h3>
          <div>Product Title:</div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <div>Price:</div>
          <input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Price" />
          <div>Stock:</div>
          <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} placeholder="Stock" />
          <button onClick={() => addProduct({ variables: { input: { title, price, stock } } })}>
            Add
          </button>
        </div>

        <div>
          <h3>Update Price</h3>
          <div>Product ID:</div>
          <input type="number" value={updateId} onChange={e => setUpdateId(parseInt(e.target.value))} placeholder="ID" />
          <div>New Price:</div>
          <input type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} placeholder="Price" />
          <button onClick={() => updatePrice({ variables: { productId: updateId, price } })}>
            Update Price
          </button>
        </div>

        <div>
          <h3>Update Stock</h3>
          <div>Product ID:</div>
          <input type="number" value={updateId} onChange={e => setUpdateId(parseInt(e.target.value))} placeholder="ID" />
          <div>Stock:</div>
          <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value))} placeholder="Stock" />
          <button onClick={() => updateStock({ variables: { productId: updateId, stock } })}>
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
