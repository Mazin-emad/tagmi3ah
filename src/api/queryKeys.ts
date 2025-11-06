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
  brands: {
    all: ["brands"] as const,
    paged: (page: number, size: number) => ["brands", { page, size }] as const,
    byId: (id: number) => ["brands", "byId", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    paged: (page: number, size: number) => ["categories", { page, size }] as const,
    byId: (id: number) => ["categories", "byId", id] as const,
  },
} as const;

