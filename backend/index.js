import express from "express";
import pkg from "@prisma/client";
import cors from "cors";

const { PrismaClient } = pkg;
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// GET todos los productos
app.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// POST crear producto
app.post("/products", async (req, res) => {
  const { name, description, price, category } = req.body;

  // Lista de imágenes por categoría
  const categoryImages = {
    clothes: "https://source.unsplash.com/400x300/?clothes",
    shoes: "https://source.unsplash.com/400x300/?shoes",
    tech: "https://source.unsplash.com/400x300/?tech",
    food: "https://source.unsplash.com/400x300/?food",
    accessories: "https://source.unsplash.com/400x300/?accessories",
    default: "https://source.unsplash.com/400x300/?product",
  };

  // Imagen según categoría
  const image = categoryImages[category?.toLowerCase()] || categoryImages.default;

  try {
    const product = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image, category },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// PUT actualizar producto
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  const categoryImages = {
    clothes: "https://source.unsplash.com/400x300/?clothes",
    shoes: "https://source.unsplash.com/400x300/?shoes",
    tech: "https://source.unsplash.com/400x300/?tech",
    food: "https://source.unsplash.com/400x300/?food",
    accessories: "https://source.unsplash.com/400x300/?accessories",
    default: "https://source.unsplash.com/400x300/?product",
  };
  const image = categoryImages[category?.toLowerCase()] || categoryImages.default;

  try {
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price: parseFloat(price), category, image },
    });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// DELETE producto
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});