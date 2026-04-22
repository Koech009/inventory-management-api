import { useEffect, useState } from "react";
import API from "../api/axios";

export function useInventory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Fetch all inventory transactions
  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory");
      setTransactions(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory.");
    }
  };

  // Add a new transaction (restock or sale)
  const addTransaction = async (transaction) => {
    try {
      await API.post("/inventory", transaction);
      fetchInventory();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction.");
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      await API.put(`/inventory/${id}`, updatedTransaction);
      fetchInventory();
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Failed to update transaction.");
    }
  };

  // Delete a transaction
  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/inventory/${id}`);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
    }
  };

  // Load transactions on mount
  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    transactions,
    error,
    fetchInventory,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
