import { useEffect, useState } from "react";
import API from "../api/axios";

export function useCategory() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  };

  // Add a new category
  const addCategory = async (category) => {
    try {
      await API.post("/categories", category);
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category.");
    }
  };

  // Update an existing category
  const updateCategory = async (id, updatedCategory) => {
    try {
      await API.put(`/categories/${id}`, updatedCategory);
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      setError("Failed to update category.");
    }
  };

  // Delete a category
  const deleteCategory = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  // Load categories on mount
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
