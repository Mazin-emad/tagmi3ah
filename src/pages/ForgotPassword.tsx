import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRequestPasswordReset } from "@/hooks";

const ForgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof ForgotSchema>;

const ForgotPassword = () => {
  const { mutate: requestReset, isPending } = useRequestPasswordReset();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotFormData>({ resolver: zodResolver(ForgotSchema) });

  const onSubmit = (data: ForgotFormData) => {
    requestReset(
      { email: data.email },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "If that email exists, a reset link was sent.");
          reset();
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to send password reset email.");
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
              Forgot password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Sending..." : "Send reset link"}
              </Button>
              <p className="text-xs text-slate-500 text-center">
                We'll send you a secure link to reset your password.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
