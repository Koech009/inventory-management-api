import { useEffect, useState } from "react";
import API from "../api/axios";

export function useInventory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await API.get("/inventory?per_page=100");
      setTransactions(res.data.transactions ?? []);
      setError("");
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setError("Failed to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction) => {
    try {
      await API.post("/inventory", {
        product_id: transaction.product_id,
        movement_type: transaction.movement_type,
        quantity: transaction.quantity,
        notes: transaction.notes ?? null,
      });
      await fetchInventory();
    } catch (err) {
      console.error("Error adding transaction:", err);
      setError("Failed to add transaction.");
      throw err;
    }
  };

  const updateTransaction = async (id, updatedTransaction) => {
    try {
      await API.put(`/inventory/${id}`, {
        product_id: updatedTransaction.product_id,
        movement_type: updatedTransaction.movement_type,
        quantity: updatedTransaction.quantity,
        notes: updatedTransaction.notes ?? null,
      });
      await fetchInventory();
    } catch (err) {
      console.error("Error updating transaction:", err);
      setError("Failed to update transaction.");
      throw err;
    }
  };

  // soft delete — marks as deleted, reverses stock on backend
  const softDeleteTransaction = async (id) => {
    try {
      await API.patch(`/inventory/${id}/delete`);
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, is_deleted: true } : t)),
      );
    } catch (err) {
      console.error("Error marking transaction as deleted:", err);
      setError("Failed to mark transaction as deleted.");
      throw err;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    transactions,
    loading,
    error,
    fetchInventory,
    addTransaction,
    updateTransaction,
    softDeleteTransaction,
  };
}
