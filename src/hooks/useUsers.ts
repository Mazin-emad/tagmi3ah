import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/users";
import { queryKeys } from "@/api/queryKeys";
import type { ChangePasswordRequest, UpdateMeRequest } from "@/api/types";

/**
 * Hook to get current authenticated user
 * Query key: ["auth","me"]
 * Retry: false (don't retry auth failures)
 *
 * @example
 * ```tsx
 * const { data: user, isLoading, isError, error } = useMe();
 * if (isLoading) return <Spinner />;
 * if (isError) return <div>Error: {error.message}</div>;
 * return <div>Welcome, {user?.name || user?.email}</div>;
 * ```
 */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => usersApi.getMe(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get all users (admin only)
 * Query key: ["users","all"]
 * Only enabled when user is admin (you can customize this condition)
 *
 * @example
 * ```tsx
 * const { data: users, isLoading } = useAllUsers({ enabled: isAdmin });
 * return (
 *   <ul>
 *     {users?.map(user => <li key={user.id}>{user.email}</li>)}
 *   </ul>
 * );
 * ```
 */
export function useAllUsers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.users.allUsers,
    queryFn: () => usersApi.getAllUsers(),
    enabled: options?.enabled ?? true,
    retry: false,
  });
}

/**
 * Hook to change current user's password
 * Optionally invalidates ["auth","me"] on success
 *
 * @example
 * ```tsx
 * const { mutate: changePassword, isPending } = useChangeMyPassword();
 * changePassword(
 *   { currentPassword: "old", newPassword: "new123" },
 *   {
 *     onSuccess: () => toast.success("Password changed!"),
 *     onError: (error) => toast.error(error.message),
 *   }
 * );
 * ```
 */
export function useChangeMyPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => usersApi.changePassword(data),
    onSuccess: () => {
      // Optionally invalidate user data after password change
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMeRequest) => usersApi.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
