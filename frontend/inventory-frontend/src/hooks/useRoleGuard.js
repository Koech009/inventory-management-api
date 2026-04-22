import { useAuth } from "./useAuth";

/**
 * Hook to check if the current user has the required role.
 * @param {string} requiredRole - The role you want to guard against (e.g., "admin", "manager", "staff").
 * @returns {boolean} - True if the user has the required role, false otherwise.
 */
export function useRoleGuard(requiredRole) {
  const { user } = useAuth();

  if (!user) return false; // not logged in
  return user.role === requiredRole;
}
