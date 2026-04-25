import { useEffect, useState } from "react";
import API from "../api/axios";

export function useInventory() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  // Fetch all inventory transactions
  const fetchInventory = async () => {
    try {
      const res = await API.get("/inventory?per_page=100");
      setTransactions(res.data.transactions ?? []);
      setError("");
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory.");
    }
  };

  // Add a new transaction
  const addTransaction = async (transaction) => {
    try {
      await API.post("/inventory", {
        product_id: transaction.product_id,
        user_id: transaction.user_id,
        type: transaction.type,
        movement_type: transaction.movement_type,
        quantity: transaction.quantity,
      });
      fetchInventory();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction.");
    }
  };

  // Update an existing transaction
  const updateTransaction = async (id, updatedTransaction) => {
    try {
      await API.put(`/inventory/${id}`, {
        product_id: updatedTransaction.product_id,
        user_id: updatedTransaction.user_id,
        type: updatedTransaction.type,
        movement_type: updatedTransaction.movement_type,
        quantity: updatedTransaction.quantity,
      });
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
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
    }
  };

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
