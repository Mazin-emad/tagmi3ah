# API Setup Guide

This guide shows how to set up and use the API layer with React Query and Axios.

## Installation

First, install the required dependencies:

```bash
npm install axios @tanstack/react-query
```

## Environment Configuration

Create a `.env` file in the project root (or add to existing `.env`):

```env
VITE_API_BASE_URL=http://localhost:8080
```

The API client will fall back to `http://localhost:8080` if this variable is not set.

## QueryClientProvider Setup

Wrap your app with `QueryClientProvider` in `main.tsx` or `App.tsx`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app components */}
      <YourApp />
      {/* Optional: React Query DevTools (only in development) */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

If you want React Query DevTools (recommended for development):

```bash
npm install @tanstack/react-query-devtools
```

## Usage Examples

### Login Example

```tsx
import { useLogin } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    login(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      },
      {
        onSuccess: () => {
          toast.success("Logged in successfully!");
          navigate("/dashboard");
        },
        onError: (error) => {
          toast.error(error.message || "Login failed");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

### Get Current User Example

```tsx
import { useMe } from "@/hooks";

function ProfilePage() {
  const { data: user, isLoading, isError, error } = useMe();

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    if (error.status === 401) {
      // Redirect to login
      return <Navigate to="/login" />;
    }
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {user?.email}</p>
      <p>Name: {user?.name || "Not set"}</p>
      <p>Roles: {user?.roles?.join(", ") || "None"}</p>
    </div>
  );
}
```

### Registration Example

```tsx
import { useRegister } from "@/hooks";
import { toast } from "sonner";

function RegisterPage() {
  const { mutate: register, isPending } = useRegister();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    register(
      {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        name: formData.get("name") as string,
      },
      {
        onSuccess: (data) => {
          toast.success(`Account created! Please check your email to confirm.`);
        },
        onError: (error) => {
          toast.error(error.message || "Registration failed");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" type="text" placeholder="Name (optional)" />
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
```

### Change Password Example

```tsx
import { useChangeMyPassword } from "@/hooks";
import { toast } from "sonner";

function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangeMyPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    changePassword(
      {
        currentPassword: formData.get("currentPassword") as string,
        newPassword: formData.get("newPassword") as string,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          e.currentTarget.reset();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to change password");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="currentPassword" type="password" required />
      <input name="newPassword" type="password" required />
      <button type="submit" disabled={isPending}>
        {isPending ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
}
```

### Logout Example

```tsx
import { useLogout } from "@/hooks";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login");
      },
    });
  };

  return (
    <button onClick={handleLogout} disabled={isPending}>
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
```

### Admin: Get All Users Example

```tsx
import { useAllUsers, useMe } from "@/hooks";

function AdminUsersPage() {
  const { data: currentUser } = useMe();
  const isAdmin = currentUser?.roles?.includes("admin") ?? false;
  const { data: users, isLoading } = useAllUsers({ enabled: isAdmin });

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>
            {user.email} - {user.name || "No name"} - Roles: {user.roles?.join(", ") || "None"}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Error Handling

All hooks return typed errors that you can handle:

```tsx
import { useMe } from "@/hooks";
import { AuthError } from "@/api";

function MyComponent() {
  const { data, error } = useMe();

  if (error) {
    // Check if it's an authentication error
    if (error instanceof AuthError || error.status === 401) {
      // Handle auth error (redirect to login, show message, etc.)
      return <Navigate to="/login" />;
    }

    // Handle other errors
    return <div>Error: {error.message}</div>;
  }

  return <div>User: {data?.email}</div>;
}
```

## Query Key Management

Query keys are centralized in `src/api/queryKeys.ts`. This helps with:

- Type safety
- Consistency across the app
- Easy invalidation after mutations

Example invalidation:

```tsx
import { queryClient, queryKeys } from "@/api";

// Invalidate after a mutation
queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
```

## Cookie Handling

The API layer handles cookies automatically:

- All requests include `withCredentials: true`
- Cookies are httpOnly (managed by server)
- On logout, the server clears the cookie (you don't need to manually delete it)
- The client never reads the JWT cookie directly (security best practice)

## TypeScript Support

All hooks and API functions are fully typed. You'll get:

- Autocomplete for request/response types
- Type checking for mutation parameters
- Typed error objects
- IntelliSense support in your IDE

