import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useConfirmAccount, useRequireEmailConfirmation } from "@/hooks";
import { useNavigate } from "react-router-dom";

const ResendSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ResendFormData = z.infer<typeof ResendSchema>;

const VerifyEmail = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token") || "";

  const { mutate: confirmAccount, isPending: confirming } = useConfirmAccount();
  const { mutate: requireConfirm, isPending: resending } =
    useRequireEmailConfirmation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendFormData>({ resolver: zodResolver(ResendSchema) });
  const navigate = useNavigate();
  const didRunRef = useRef(false);
  const handledResultRef = useRef(false);
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    if (!token || didRunRef.current) return;
    didRunRef.current = true; // StrictMode-safe one-shot guard
    confirmAccount(token, {
      onSuccess: (res) => {
        handledResultRef.current = true;
        if (res?.success) {
          toast.success("Email verified successfully!", {
            id: "verify-success",
          });
          navigate("/login");
        } else {
          toast.info(res?.message || "Verification processed.", {
            id: "verify-info",
          });
        }
      },
      onError: (error) => {
        if (handledResultRef.current) return;
        const err = error as { message?: string };
        toast.error(err?.message || "Verification failed.", {
          id: "verify-error",
        });
        setShowResend(true);
      },
    });
  }, [token, confirmAccount, navigate]);

  const onResend = (data: ResendFormData) => {
    requireConfirm(
      { email: data.email },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Confirmation email sent.");
        },
        onError: (error) => {
          toast.error(error?.message || "Failed to send confirmation email.");
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
              Verify your email
            </CardTitle>
          </CardHeader>
          <CardContent>
            {token && !showResend ? (
              <div className="text-center space-y-2">
                <p className="text-slate-600">
                  Processing your verification token...
                </p>
                {confirming && (
                  <p className="text-sm text-slate-500">Verifying...</p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onResend)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Your email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={resending} className="w-full">
                  {resending ? "Sending..." : "Resend verification email"}
                </Button>
                <p className="text-xs text-slate-500 text-center">
                  Provide your account email to receive a new confirmation link.
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
