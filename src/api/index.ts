/**
 * Barrel export for API layer
 * Export all types, hooks, and utilities
 */

// Types
export type {
  ApiError,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthConfirmResponse,
  AuthForgotPasswordRequest,
  AuthForgotPasswordResponse,
  AuthRequireConfirmRequest,
  AuthRequireConfirmResponse,
  AuthResetPasswordRequest,
  AuthResetPasswordResponse,
  LogoutResponse,
  MeResponse,
  AllUsersResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  CreateProductRequest,
  CreateProductResponse,
  ProductsResponse,
  UpdateMetadataRequest,
  UpdateMetadataResponse,
  UpdateMeRequest,
  UpdateMeResponse,
  OrderDto,
  OrdersResponse,
  OrderStatusRequest,
  OrderPaymentRequest,
  OrderPaymentResponse,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
  ProductDto,
  OrderItemDto,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  ChatRole,
} from "./types";

export { AuthError } from "./types";

// API Clients
export { apiClient } from "./axios";
export { authApi } from "./auth";
export { usersApi } from "./users";
export { productsApi } from "./products";
export { metadataApi } from "./metadata";
export {
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  prepareOrder,
  getAllOrders,
  getOrdersByUserId,
  getMyOrders,
  handleStripeWebhook,
} from "./orders";
export { sendChatMessage } from "./chat";

// Query Keys
export { queryKeys } from "./queryKeys";

// Error utilities
export { toApiError } from "./errors";

// Re-export Product from unified types
export type { Product } from "@/types/product";
