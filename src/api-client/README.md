# API Client Documentation

A comprehensive TypeScript React client for your backend API with React Query and Axios.

## Quick Start

### 1. Install Dependencies

```bash
npm install axios @tanstack/react-query
npm install -D @tanstack/react-query-devtools  # Optional, for dev tools
```

### 2. Set Environment Variable

Create or update `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Setup QueryClientProvider

See `example-setup.tsx` for integration example. Wrap your app:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### 4. Use Hooks

```tsx
import { useLogin, useMe } from "@/api-client";

function MyComponent() {
  const { data: user } = useMe();
  const { mutate: login } = useLogin();
  
  // Use hooks...
}
```

## Architecture

### File Structure

```
src/
├── api/
│   ├── axios.ts          # Axios instance with interceptors
│   ├── types.ts          # TypeScript types and DTOs
│   ├── errors.ts         # Error handling utilities
│   ├── auth.ts           # Auth API functions
│   ├── users.ts          # Users API functions
│   ├── queryKeys.ts      # Centralized query keys
│   └── index.ts          # Barrel export
├── hooks/
│   ├── useAuth.ts        # Auth hooks
│   ├── useUsers.ts       # User hooks
│   └── index.ts          # Barrel export
└── api-client/
    └── index.ts          # Main barrel export
```

### Key Features

- ✅ **withCredentials: true** on all requests (for httpOnly cookies)
- ✅ Automatic error conversion (AxiosError → ApiError)
- ✅ AuthError for 401/403 responses
- ✅ Typed hooks with full TypeScript support
- ✅ Centralized query key management
- ✅ Automatic cache invalidation after mutations
- ✅ Cookie-based authentication (no manual token handling)

## Available Hooks

### Auth Hooks

| Hook | Description |
|------|-------------|
| `useRegister()` | Register new user |
| `useLogin()` | Login user (sets cookie) |
| `useLogout()` | Logout (clears cookie) |
| `useConfirmAccount()` | Confirm email with token |
| `useRequestPasswordReset()` | Request password reset email |
| `useRequireEmailConfirmation()` | Resend confirmation email |
| `useResetPassword()` | Reset password with token |

### User Hooks

| Hook | Description |
|------|-------------|
| `useMe()` | Get current user |
| `useAllUsers()` | Get all users (admin) |
| `useChangeMyPassword()` | Change current user's password |

## Error Handling

All hooks return typed `ApiError`:

```tsx
const { data, error, isError } = useMe();

if (isError) {
  // error is ApiError: { status, message, details? }
  console.log(error.status); // e.g., 401, 403, 404, 500
  console.log(error.message); // Server error message
}
```

For 401/403, an `AuthError` is thrown (extends Error):

```tsx
import { AuthError } from "@/api-client";

try {
  // ... API call
} catch (error) {
  if (error instanceof AuthError) {
    // Handle auth error (redirect to login, etc.)
    navigate("/login");
  }
}
```

## Query Keys

Query keys are centralized for consistency:

```tsx
import { queryKeys } from "@/api-client";

queryKeys.auth.me       // ["auth", "me"]
queryKeys.users.allUsers // ["users", "all"]
```

## Examples

See `src/api/setup.md` for detailed usage examples.

## Type Safety

All API functions and hooks are fully typed:

```tsx
// Request types are enforced
useLogin({
  email: "user@example.com",
  password: "password123"
  // TypeScript will error if fields are missing or wrong type
});

// Response types are inferred
const { data } = useMe();
// data is typed as MeResponse | undefined
```

## Cookie Management

The API handles httpOnly cookies automatically:

- ✅ Cookies sent with every request (`withCredentials: true`)
- ✅ Server sets cookie on login
- ✅ Server clears cookie on logout
- ✅ Client never reads cookie (security best practice)
- ✅ No manual token storage needed

## Configuration

### Base URL

Set via environment variable:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Falls back to `http://localhost:8080` if not set.

### QueryClient Options

Customize in your setup:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## Troubleshooting

### CORS Issues

Make sure your backend allows credentials:

```javascript
// Express example
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Cookie Not Being Sent

The Axios instance enforces `withCredentials: true` in an interceptor. If cookies aren't being sent, check:

1. Backend CORS configuration
2. Cookie domain/path settings
3. Browser DevTools → Network → Request Headers

### 401/403 Errors

These automatically throw `AuthError`. Handle appropriately:

```tsx
const { error } = useMe();
if (error?.status === 401) {
  // Redirect to login
}
```

## Next Steps

1. Integrate `QueryClientProvider` (see `example-setup.tsx`)
2. Use hooks in your components (see `setup.md`)
3. Handle auth errors with redirect logic
4. Add loading states and error boundaries

For detailed examples, see `src/api/setup.md`.

