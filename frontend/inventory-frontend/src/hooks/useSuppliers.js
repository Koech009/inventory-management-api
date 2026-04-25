import { useEffect, useState } from "react";
import API from "../api/axios";

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState("");

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/suppliers?per_page=100");
      setSuppliers(res.data.suppliers ?? []);
      setError("");
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Failed to load suppliers.");
    }
  };

  const addSupplier = async (supplier) => {
    try {
      await API.post("/suppliers", supplier);
      fetchSuppliers();
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError("Failed to add supplier.");
    }
  };

  const updateSupplier = async (id, updatedSupplier) => {
    try {
      await API.put(`/suppliers/${id}`, updatedSupplier);
      fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError("Failed to update supplier.");
    }
  };

  const deleteSupplier = async (id) => {
    try {
      await API.delete(`/suppliers/${id}`);
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting supplier:", err);
      setError("Failed to delete supplier.");
    }
  };

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
