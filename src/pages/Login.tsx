import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginProps {
  onLogin?: (data: LoginFormData) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Call the onLogin prop if provided, otherwise handle default login logic
      if (onLogin) {
        onLogin(data);
      } else {
        // Default login logic - you can replace this with your actual authentication
        console.log("Login data:", data);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Navigate to dashboard or home page
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password page or show modal
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    // Navigate to register page
    navigate("/register");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-[480px] w-full">
          {/* Logo */}
          <Link to="/" className="block">
            <img
              src="/src/assets/imgs/logo.png"
              alt="Tagmi3ah Logo"
              className="w-40 mb-8 mx-auto block"
            />
          </Link>

          {/* Login Card */}
          <Card className="shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-semibold text-slate-900">
                Sign in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="username"
                    className="text-slate-900 text-sm font-medium"
                  >
                    Username
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className="pl-10 pr-4 py-3"
                      {...register("username")}
                    />
                  </div>
                  {errors.username && (
                    <p className="text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-slate-900 text-sm font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-12 py-3"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember-me" {...register("rememberMe")} />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm text-slate-900"
                    >
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary cursor-pointer hover:underline font-semibold"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 text-base font-medium"
                  size="lg"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </Button>

                {/* Register Link */}
                <p className="text-slate-900 text-sm text-center">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={handleRegister}
                    className="text-primary cursor-pointer hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
