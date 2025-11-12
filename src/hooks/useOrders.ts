import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  prepareOrder,
  getAllOrders,
  getOrdersByUserId,
  getMyOrders,
  handleStripeWebhook,
} from "@/api/orders";
import { queryKeys } from "@/api/queryKeys";
import type {
  OrderStatusRequest,
  OrderPaymentRequest,
  OrderDto,
  OrdersResponse,
  OrderPaymentResponse,
  ApiError,
} from "@/api/types";

/**
 * Hook to get order by ID
 * Returns order details with loading, error, and data states
 * Note: React Query returns `isLoading` (not `loading`) - you can alias it: `const { isLoading: loading } = useGetOrderById(id)`
 *
 * @param id - Order ID
 * @returns { data, error, isLoading, refetch } - Standard React Query return values
 *
 * @example
 * ```tsx
 * const { data: order, isLoading, error, refetch } = useGetOrderById(orderId);
 * // Or alias loading: const { data, error, isLoading: loading, refetch } = useGetOrderById(orderId);
 * ```
 */
export function useGetOrderById(id: number) {
  return useQuery<OrderDto, ApiError>({
    queryKey: queryKeys.orders.byId(id),
    queryFn: () => getOrderById(id),
    enabled: !!id && id > 0,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to update order status (Admin only)
 * Invalidates order queries on success
 *
 * @returns { mutate, isPending, error, data }
 *
 * @example
 * ```tsx
 * const { mutate: updateOrder, isPending } = useUpdateOrder();
 * updateOrder(
 *   { id: 1, orderStatus: "CONFIRMED", paymentStatus: "PAID" },
 *   { onSuccess: () => toast.success("Order updated!") }
 * );
 * ```
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderDto, ApiError, { id: number; body: OrderStatusRequest }>({
    mutationFn: ({ id, body }) => updateOrderStatus(id, body),
    onSuccess: (_, variables) => {
      // Invalidate order queries
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.byId(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.me });
    },
  });
}

/**
 * Hook to cancel an order
 * Invalidates order queries on success
 *
 * @returns { mutate, isPending, error }
 *
 * @example
 * ```tsx
 * const { mutate: cancel, isPending } = useCancelOrder();
 * cancel(orderId, {
 *   onSuccess: () => toast.success("Order cancelled!"),
 * });
 * ```
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: () => {
      // Invalidate all order queries
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.me });
    },
  });
}

/**
 * Hook to prepare a new order for payment
 * Invalidates order queries on success
 *
 * @returns { mutate, isPending, error, data }
 *
 * @example
 * ```tsx
 * const { mutate: prepare, isPending, data } = usePrepareOrder();
 * prepare(
 *   { paymentMethod: "CARD" },
 *   {
 *     onSuccess: (response) => {
 *       if (response.url) {
 *         window.location.href = response.url; // Redirect to Stripe
 *       }
 *     },
 *   }
 * );
 * ```
 */
export function usePrepareOrder() {
  const queryClient = useQueryClient();

  return useMutation<OrderPaymentResponse, ApiError, OrderPaymentRequest>({
    mutationFn: (body: OrderPaymentRequest) => prepareOrder(body),
    onSuccess: () => {
      // Invalidate cart and orders after order preparation
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.me });
      queryClient.invalidateQueries({ queryKey: ["cart", "me"] });
    },
  });
}

/**
 * Hook to get all orders (Admin only)
 * Returns list of all orders with loading, error, and data states
 * Note: React Query returns `isLoading` (not `loading`)
 *
 * @returns { data, error, isLoading, refetch } - Standard React Query return values
 *
 * @example
 * ```tsx
 * const { data: orders, isLoading, error, refetch } = useGetAllOrders();
 * ```
 */
export function useGetAllOrders() {
  return useQuery<OrdersResponse, ApiError>({
    queryKey: queryKeys.orders.all,
    queryFn: () => getAllOrders(),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to get all orders for a specific user (Admin only)
 * Returns list of orders for the user with loading, error, and data states
 * Note: React Query returns `isLoading` (not `loading`)
 *
 * @param userId - User ID
 * @returns { data, error, isLoading, refetch } - Standard React Query return values
 *
 * @example
 * ```tsx
 * const { data: orders, isLoading, error, refetch } = useGetOrdersByUserId(userId);
 * ```
 */
export function useGetOrdersByUserId(userId: number) {
  return useQuery<OrdersResponse, ApiError>({
    queryKey: queryKeys.orders.byUserId(userId),
    queryFn: () => getOrdersByUserId(userId),
    enabled: !!userId && userId > 0,
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to get current user's orders
 * Returns list of current user's orders with loading, error, and data states
 * Note: React Query returns `isLoading` (not `loading`)
 *
 * @returns { data, error, isLoading, refetch } - Standard React Query return values
 *
 * @example
 * ```tsx
 * const { data: myOrders, isLoading, error, refetch } = useGetMyOrders();
 * ```
 */
export function useGetMyOrders() {
  return useQuery<OrdersResponse, ApiError>({
    queryKey: queryKeys.orders.me,
    queryFn: () => getMyOrders(),
    staleTime: 30_000, // 30 seconds
  });
}

/**
 * Hook to handle Stripe webhook event
 * Typically used server-side, but available for client-side webhook handling if needed
 *
 * @returns { mutate, isPending, error, data }
 *
 * @example
 * ```tsx
 * const { mutate: handleWebhook, isPending } = useHandleStripeWebhook();
 * handleWebhook(webhookPayload);
 * ```
 */
export function useHandleStripeWebhook() {
  return useMutation<unknown, ApiError, unknown>({
    mutationFn: (body: unknown) => handleStripeWebhook(body),
  });
}

