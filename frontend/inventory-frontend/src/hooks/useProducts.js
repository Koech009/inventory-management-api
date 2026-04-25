import { useEffect, useState } from "react";
import API from "../api/axios";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  const fetchProducts = async (pageNum = page) => {
    try {
      const res = await API.get(`/products?page=${pageNum}&per_page=10`);
      setProducts(res.data.products ?? []);
      setMeta(res.data.meta);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    }
  };

  const nextPage = () => {
    if (meta?.has_next) {
      const next = page + 1;
      setPage(next);
      fetchProducts(next);
    }
  };

  const prevPage = () => {
    if (meta?.has_prev) {
      const prev = page - 1;
      setPage(prev);
      fetchProducts(prev);
    }
  };

  const addProduct = async (product) => {
    try {
      await API.post("/products", product);
      fetchProducts(page);
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product.");
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      await API.put(`/products/${id}`, updatedProduct);
      fetchProducts(page);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("Failed to update product.");
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product.");
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  return {
    products,
    meta,
    page,
    error,
    fetchProducts,
    nextPage,
    prevPage,
    addProduct,
    updateProduct,
    deleteProduct,
  };
}
