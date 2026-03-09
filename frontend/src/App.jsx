import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, price }),
    });
    const data = await response.json();
    setProducts([...products, data]);
    setName(""); setDescription(""); setPrice("");
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:4000/products/${id}`, { method: "DELETE" });
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdate = async (product) => {
    const newName = prompt("Nuevo nombre:", product.name);
    const newDescription = prompt("Nueva descripción:", product.description);
    const newPrice = prompt("Nuevo precio:", product.price);
    if (!newName || !newDescription || !newPrice) return;
    const response = await fetch(`http://localhost:4000/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDescription, price: parseFloat(newPrice) }),
    });
    const updated = await response.json();
    setProducts(products.map(p => (p.id === updated.id ? updated : p)));
  };

  return (
    <div className="container">
      {/* Formulario */}
      <div className="form-card">
        <h2>Agregar Producto</h2>
        <form onSubmit={handleSubmit}>
          <input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Descripción" value={description} onChange={e => setDescription(e.target.value)} />
          <input placeholder="Precio" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
          <div className="buttons">
            <button type="submit">Agregar</button>
            <button type="button" onClick={() => { setName(""); setDescription(""); setPrice(""); }}>Limpiar</button>
          </div>
        </form>
      </div>

      {/* Lista de productos */}
      <h2>Productos Disponibles</h2>
      <div className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p className="price">${p.price.toFixed(2)}</p>
            <div className="actions">
              <button className="edit" onClick={() => handleUpdate(p)}>Editar</button>
              <button className="delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;