/**
 * Barrel export for React Query hooks
 */
export {
  useRegister,
  useConfirmAccount,
  useLogin,
  useLogout,
  useRequestPasswordReset,
  useRequireEmailConfirmation,
  useResetPassword,
} from "./useAuth";

export {
  useMe,
  useAllUsers,
  useChangeMyPassword,
  useUpdateMe,
} from "./useUsers";

export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "./useProducts";

export { useMetadata, useUpdateMetadata } from "./useMetadata";

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

export { useChat } from "./useChat";

export { useProductData } from "./useProductData";
export { useProductsData } from "./useProductsData";
export { useProductFilters } from "./useProductFilters";
export { usePagination } from "./usePagination";
export { useQuantity } from "./useQuantity";