import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useResetPassword } from "@/hooks";
import type { ApiError } from "@/api/types";

const ResetSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Must contain uppercase, lowercase and a number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof ResetSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "";

  const { mutate: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ResetFormData>({ resolver: zodResolver(ResetSchema) });

  const onSubmit = (data: ResetFormData) => {
    if (!token) {
      toast.error("Reset token is missing. Please use the link from your email.");
      return;
    }
    resetPassword(
      { token, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success("Password reset successfully. Please sign in.");
          navigate("/login");
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          const fieldErrors = apiError?.fieldErrors;
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              if (["newPassword", "confirmPassword"].includes(field)) {
                setError(field as keyof ResetFormData, { message });
              }
            });
          }
          toast.error(apiError?.message || "Failed to reset password.");
        },
      }
    );
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        <Card className="shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold text-slate-900">
              Reset your password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter a strong password"
                  {...register("newPassword")}
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your new password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Resetting..." : "Reset password"}
              </Button>
              {!token && (
                <p className="text-xs text-red-600 text-center">
                  Missing token. Please use the link sent to your email.
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
