import { jsonApiClient } from "./product/client";
import type { AxiosResponse } from "axios";
import type {
  OrderDto,
  OrdersResponse,
  OrderStatusRequest,
  OrderPaymentRequest,
  OrderPaymentResponse,
} from "./types";

export type {
  OrderDto,
  OrdersResponse,
  OrderStatusRequest,
  OrderPaymentRequest,
  OrderPaymentResponse,
};

/**
 * Get order by ID
 * @param id - Order ID
 * @returns Order details
 */
export async function getOrderById(id: number): Promise<OrderDto> {
  const res: AxiosResponse<OrderDto> = await jsonApiClient.get(`/orders/${id}`);
  return res.data;
}

/**
 * Update order status (Admin only)
 * @param id - Order ID
 * @param body - Order status update request
 * @returns Updated order details
 */
export async function updateOrderStatus(
  id: number,
  body: OrderStatusRequest
): Promise<OrderDto> {
  const res: AxiosResponse<OrderDto> = await jsonApiClient.put(
    `/orders/${id}`,
    body
  );
  return res.data;
}

/**
 * Cancel an order
 * @param id - Order ID
 * @returns Void on success
 */
export async function cancelOrder(id: number): Promise<void> {
  await jsonApiClient.delete(`/orders/${id}`);
}

/**
 * Prepare a new order for payment
 * @param body - Payment method selection
 * @returns Payment response with payment URL (for CARD) or order confirmation (for CASH)
 */
export async function prepareOrder(
  body: OrderPaymentRequest
): Promise<OrderPaymentResponse> {
  const res: AxiosResponse<OrderPaymentResponse> = await jsonApiClient.post(
    "/orders/me/prepare",
    body
  );
  return res.data;
}

/**
 * Get all orders (Admin only)
 * @returns List of all orders
 */
export async function getAllOrders(): Promise<OrdersResponse> {
  const res: AxiosResponse<OrdersResponse> = await jsonApiClient.get("/orders");
  return res.data;
}

/**
 * Get all orders for a specific user (Admin only)
 * @param userId - User ID
 * @returns List of orders for the user
 */
export async function getOrdersByUserId(
  userId: number
): Promise<OrdersResponse> {
  const res: AxiosResponse<OrdersResponse> = await jsonApiClient.get(
    `/orders/user/${userId}`
  );
  return res.data;
}

/**
 * Get current user's orders
 * @returns List of current user's orders
 */
export async function getMyOrders(): Promise<OrdersResponse> {
  const res: AxiosResponse<OrdersResponse> = await jsonApiClient.get(
    "/orders/me"
  );
  return res.data;
}

/**
 * Handle Stripe webhook event
 * @param body - Stripe webhook payload (raw body)
 * @returns Webhook processing result
 */
export async function handleStripeWebhook(body: unknown): Promise<unknown> {
  const res: AxiosResponse<unknown> = await jsonApiClient.post(
    "/stripe/webhook",
    body
  );
  return res.data;
}

