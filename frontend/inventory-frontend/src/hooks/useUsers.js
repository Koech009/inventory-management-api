// src/hooks/useUsers.js
import { useState, useEffect } from "react";
import API from "../api/axios";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
    }
  };

  const deleteUser = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user.");
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      const user = users.find((u) => u.id === id);
      if (!user) return;
      const updated = { ...user, role: newRole };
      await API.put(`/users/${id}`, updated);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, error, fetchUsers, deleteUser, updateUserRole };
}
