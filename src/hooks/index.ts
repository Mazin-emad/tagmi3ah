/**
 * Barrel export for React Query hooks
 */

// Auth hooks
export {
  useRegister,
  useConfirmAccount,
  useLogin,
  useLogout,
  useRequestPasswordReset,
  useRequireEmailConfirmation,
  useResetPassword,
} from "./useAuth";

// User hooks
export {
  useMe,
  useAllUsers,
  useChangeMyPassword,
  useUpdateMe,
} from "./useUsers";

// Product hooks
export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./useProducts";

// Metadata hooks
export { useMetadata, useUpdateMetadata } from "./useMetadata";

// Order hooks
export {
  useGetOrderById,
  useUpdateOrder,
  useCancelOrder,
  usePrepareOrder,
  useGetAllOrders,
  useGetOrdersByUserId,
  useGetMyOrders,
  useHandleStripeWebhook,
} from "./useOrders";