import { useEffect, useState } from "react";
import API from "../api/axios";

export function useCategory() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories?per_page=100");
      setCategories(res.data.categories ?? []);
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  };

  const addCategory = async (category) => {
    try {
      await API.post("/categories", category);
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category.");
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      await API.put(`/categories/${id}`, updatedCategory);
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category.");
    }
  };

  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    error,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
