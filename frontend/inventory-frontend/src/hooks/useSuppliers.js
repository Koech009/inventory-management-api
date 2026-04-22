import { useEffect, useState } from "react";
import API from "../api/axios";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");

  // Fetch all suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers");
      setSuppliers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers.");
    }
  };

  // Add a new supplier
  const addSupplier = async (supplier) => {
    try {
      await API.post("/suppliers", supplier);
      fetchSuppliers();
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError("Failed to add supplier.");
    }
  };

  // Update an existing supplier
  const updateSupplier = async (id, updatedSupplier) => {
    try {
      await API.put(`/suppliers/${id}`, updatedSupplier);
      fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError("Failed to update supplier.");
    }
  };

  // Delete a supplier
  const deleteSupplier = async (id) => {
    try {
      await API.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Failed to delete supplier.");
    }
  };

  // Load suppliers on mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  return {
    suppliers,
    error,
    fetchSuppliers,
    addSupplier,
    updateSupplier,
    deleteSupplier,
  };
}
