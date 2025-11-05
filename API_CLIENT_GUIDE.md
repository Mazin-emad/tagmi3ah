# API Client Implementation Summary

A complete TypeScript React API client has been created for your backend at `http://localhost:8080`.

## 📦 What Was Created

### Core API Layer (`src/api/`)
- **`axios.ts`** - Configured Axios instance with `withCredentials: true` and error interceptors
- **`types.ts`** - All TypeScript types (DTOs, ApiError, AuthError)
- **`errors.ts`** - Error conversion utilities (AxiosError → ApiError)
- **`auth.ts`** - Auth API functions
- **`users.ts`** - Users API functions
- **`queryKeys.ts`** - Centralized query keys
- **`index.ts`** - Barrel export

### React Query Hooks (`src/hooks/`)
- **`useAuth.ts`** - 7 auth hooks (register, login, logout, confirm, reset password, etc.)
- **`useUsers.ts`** - 3 user hooks (me, all users, change password)
- **`index.ts`** - Barrel export

### Documentation
- **`src/api/setup.md`** - Detailed usage examples
- **`src/api-client/README.md`** - Quick reference guide
- **`src/api-client/example-setup.tsx`** - QueryClientProvider integration example

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install axios @tanstack/react-query
npm install -D @tanstack/react-query-devtools  # Optional
```

### 2. Environment Variable

Add to `.env`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Setup QueryClientProvider

Update `src/main.tsx` (see `src/api-client/example-setup.tsx` for full example):

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</QueryClientProvider>
```

### 4. Use Hooks

```tsx
import { useLogin, useMe } from "@/api-client";

function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  // ... use login
}
```

## 📚 Available Hooks

### Auth Hooks
- `useRegister()` - Register new user
- `useLogin()` - Login (sets httpOnly cookie)
- `useLogout()` - Logout (clears cookie)
- `useConfirmAccount()` - Confirm email
- `useRequestPasswordReset()` - Request reset email
- `useRequireEmailConfirmation()` - Resend confirmation
- `useResetPassword()` - Reset password with token

### User Hooks
- `useMe()` - Get current user (query key: `["auth","me"]`)
- `useAllUsers()` - Get all users - admin only
- `useChangeMyPassword()` - Change password

## 🔐 Authentication Flow

1. **Login**: `useLogin()` → Server sets httpOnly `jwt` cookie
2. **Requests**: All requests automatically include cookie (`withCredentials: true`)
3. **401/403**: Throws `AuthError` (handle with redirect to login)
4. **Logout**: `useLogout()` → Server clears cookie

## 🎯 Key Features

✅ `withCredentials: true` enforced on all requests
✅ Automatic error conversion (AxiosError → ApiError)
✅ AuthError for 401/403 with typed handling
✅ Full TypeScript support with inference
✅ Automatic cache invalidation after mutations
✅ Centralized query keys
✅ httpOnly cookie handling (no manual token management)

## 📖 Usage Examples

### Login Example
```tsx
import { useLogin } from "@/api-client";

const { mutate: login, isPending } = useLogin();

login(
  { email: "user@example.com", password: "password123" },
  {
    onSuccess: () => navigate("/dashboard"),
    onError: (error) => toast.error(error.message),
  }
);
```

### Get Current User
```tsx
import { useMe } from "@/api-client";

const { data: user, isLoading, error } = useMe();
// user is typed as MeResponse | undefined
```

### Error Handling
```tsx
import { AuthError } from "@/api-client";

if (error instanceof AuthError || error.status === 401) {
  navigate("/login");
}
```

## 📁 File Structure

```
src/
├── api/
│   ├── axios.ts           # Axios instance
│   ├── types.ts           # TypeScript types
│   ├── errors.ts          # Error utilities
│   ├── auth.ts            # Auth API
│   ├── users.ts           # Users API
│   ├── queryKeys.ts       # Query keys
│   ├── index.ts           # Barrel export
│   └── setup.md           # Detailed examples
├── hooks/
│   ├── useAuth.ts         # Auth hooks
│   ├── useUsers.ts        # User hooks
│   └── index.ts           # Barrel export
└── api-client/
    ├── index.ts           # Main export
    ├── example-setup.tsx  # Setup example
    └── README.md          # Quick guide
```

## 🔍 Query Keys

- `["auth","me"]` - Current user
- `["users","all"]` - All users

These are automatically invalidated after relevant mutations.

## 📝 Next Steps

1. Install dependencies: `npm install`
2. Add environment variable
3. Integrate QueryClientProvider
4. Start using hooks in your components!

For detailed examples, see:
- `src/api/setup.md` - Comprehensive usage guide
- `src/api-client/README.md` - Quick reference
- `src/api-client/example-setup.tsx` - Setup code

All hooks are fully typed and ready to use! 🎉

