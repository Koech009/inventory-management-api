import { useEffect, useState } from "react";
import API from "../api/axios";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    }
  };

  // Add a new product
  const addProduct = async (product) => {
    try {
      await API.post("/products", product);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    }
  };

  // Update an existing product
  const updateProduct = async (id, updatedProduct) => {
    try {
      await API.put(`/products/${id}`, updatedProduct);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
