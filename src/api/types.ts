import type { Product } from "@/types";

/**
 * Core API error type
 */
export interface ApiError {
  status: number;
  message: string;
  details?: unknown;
  fieldErrors?: Record<string, string>;
}

/**
 * Authentication Error - thrown for 401/403 responses
 */
export class AuthError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number = 401, payload?: unknown) {
    super(message);
    this.name = "AuthError";
    this.status = status;
    this.payload = payload;
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

// ============================================================================
// AUTH DTOs
// ============================================================================

export interface AuthRegisterRequest {
  email: string;
  password: string;
  emailConfirm: string;
  passwordConfirm: string;
  phoneNumber?: string;
  address?: string;
  name?: string;
}

export interface AuthRegisterResponse {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  role?: string[];
}

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name?: string;
    phoneNumber?: string;
    address?: string;
    role?: string[];
  };
}

export interface AuthConfirmResponse {
  success: boolean;
  message?: string;
}

export interface AuthForgotPasswordRequest {
  email: string;
}

export interface AuthForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface AuthRequireConfirmRequest {
  email: string;
}

export interface AuthRequireConfirmResponse {
  success: boolean;
  message?: string;
}

export interface AuthResetPasswordRequest {
  newPassword: string;
}

export interface AuthResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
}

// ============================================================================
// USER DTOs
// ============================================================================

export interface MeResponse {
  id: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  address?: string;
  role?: string[];
}

export type AllUsersResponse = MeResponse[];

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message?: string;
}

export interface UpdateMeRequest {
  name?: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateMeResponse {
  name: string;
  phoneNumber: string;
  address: string;
}

// ============================================================================
// PRODUCT DTOs
// ============================================================================

// Re-export Product from unified types
export type { Product } from "@/types/product";

export interface CreateProductRequest {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  image?: File | string;
}

export interface CreateProductResponse {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
}

export type ProductsResponse = Product[];

// ============================================================================
// METADATA DTOs
// ============================================================================

export interface UpdateMetadataRequest {
  categories?: string[];
  brands?: string[];
}

export interface UpdateMetadataResponse {
  success: boolean;
  message?: string;
  categories?: string[];
  brands?: string[];
}

// ============================================================================
// BRAND & CATEGORY DTOs
// ============================================================================

export interface Brand {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface PageRequest {
  page?: number;
  size?: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// ============================================================================
// ORDER DTOs
// ============================================================================

export type OrderStatus = "PENDING" | "CANCELED" | "CONFIRMED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PAID" | "CANCELED" | "FAILED" | "PENDING" | "UNPAID";
export type PaymentMethod = "CARD" | "CASH";

export interface ProductDto {
  id: number;
  name: string;
  categoryId: number;
  imageUrl: string;
  price: number;
  stock: number;
}

export interface OrderItemDto {
  id: number;
  product: ProductDto;
  quantity: number;
  price: number;
}

export interface OrderDto {
  orderId: number;
  userId: number;
  totalCost: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: PaymentMethod;
  orderDate: string; // ISO date-time
  deliveryDate: string; // ISO date-time
  orderItems: OrderItemDto[];
}

export interface OrderStatusRequest {
  orderStatus: "PENDING" | "CANCELED" | "CONFIRMED" | "DELIVERED";
  paymentStatus: "PAID" | "CANCELED" | "FAILED" | "PENDING";
}

export interface OrderPaymentRequest {
  paymentMethod: "CARD" | "CASH";
}

export interface OrderPaymentResponse {
  orderId: number;
  userId: number;
  amount: number;
  url: string;
  currency: string;
}

export type OrdersResponse = OrderDto[];