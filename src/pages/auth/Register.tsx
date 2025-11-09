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
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks";
import { toast } from "sonner";
import type { ApiError } from "@/api/types";

// Form validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(
            val
          ),
        "Please enter a valid phone number"
      ),
    address: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    passwordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { mutate: register, isPending } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
        emailConfirm: data.email,
        passwordConfirm: data.passwordConfirm,
      },
      {
        onSuccess: () => {
          toast.success(
            "Account created successfully! Please check your email to confirm your account."
          );
          navigate("/login");
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          const fieldErrors = apiError?.fieldErrors;
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              if (
                [
                  "name",
                  "email",
                  "phoneNumber",
                  "address",
                  "password",
                  "passwordConfirm",
                ].includes(field)
              ) {
                setError(field as keyof RegisterFormData, { message });
              }
            });
          }
          toast.error(
            apiError?.message || "Registration failed. Please try again."
          );
        },
      }
    );
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="max-w-4xl max-sm:max-w-lg w-full">
          {/* Logo */}
          <div className="text-center mb-4 sm:mb-8">
            <Link to="/" className="block">
              <img
                src="/src/assets/imgs/logo.png"
                alt="Tagmi3ah Logo"
                className="w-44 inline-block"
              />
            </Link>
          </div>

          {/* Register Card */}
          <Card className="shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-semibold text-slate-900">
                Create Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-10"
                        {...registerField("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        {...registerField("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Phone Number
                    </Label>
                    <div className="relative">
                      <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="+20 123 456 7890"
                        className="pl-10"
                        {...registerField("phoneNumber")}
                      />
                    </div>
                    {errors.phoneNumber && (
                      <p className="text-sm text-red-600">
                        {errors.phoneNumber.message}
                      </p>
                    )}
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Address
                    </Label>
                    <div className="relative">
                      <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="address"
                        type="text"
                        placeholder="Enter your address"
                        className="pl-10"
                        {...registerField("address")}
                      />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-600">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="pl-10 pr-12"
                        {...registerField("password")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
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
                    <p className="text-xs text-gray-500">
                      Must be at least 6 characters with uppercase, lowercase,
                      and a number
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="passwordConfirm"
                      className="text-slate-900 text-sm font-medium"
                    >
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="passwordConfirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="pl-10 pr-12"
                        {...registerField("passwordConfirm")}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.passwordConfirm && (
                      <p className="text-sm text-red-600">
                        {errors.passwordConfirm.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 text-center">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="cursor-pointer py-3 text-base font-medium"
                    size="lg"
                  >
                    {isPending ? "Creating Account..." : "Sign up"}
                  </Button>
                </div>

                {/* Back to Login Link */}
                <p className="text-slate-900 text-sm text-center">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-primary cursor-pointer hover:underline font-semibold"
                  >
                    Sign in here
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
