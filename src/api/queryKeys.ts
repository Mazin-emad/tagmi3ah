/**
 * Centralized query keys for React Query
 * Helps with consistency and type safety
 */

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },
  users: {
    all: ["users"] as const,
    allUsers: ["users", "all"] as const,
  },
  products: {
    all: ["products"] as const,
  },
  metadata: {
    all: ["metadata"] as const,
  },
} as const;

