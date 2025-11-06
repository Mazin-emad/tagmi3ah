import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useChangeMyPassword } from "@/hooks";
import { toast } from "sonner";
import type { ApiError } from "@/api/types";

const FormSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    newPasswordConfirm: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.newPasswordConfirm, {
    message: "Passwords don't match",
    path: ["newPasswordConfirm"],
  });

const ChangePasswordForm = () => {
  const { mutate: changePassword, isPending } = useChangeMyPassword();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  type ChangePasswordFormData = z.infer<typeof FormSchema>;

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        newPasswordConfirm: data.newPasswordConfirm,
      },
      {
        onSuccess: () => {
          toast.success("Password changed successfully!");
          form.reset();
        },
        onError: (error: unknown) => {
          const apiError = error as ApiError;
          const fieldErrors = apiError?.fieldErrors;
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, message]) => {
              if (["oldPassword", "newPassword", "newPasswordConfirm"].includes(field)) {
                form.setError(field as keyof ChangePasswordFormData, { message });
              }
            });
          }
          toast.error(apiError?.message || "Failed to change password. Please try again.");
        },
      }
    );
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>
          Change your password. Click Save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2"
          >
            <div className="grid gap-3">
              <Label htmlFor="oldPassword">Current Password</Label>
              <Input
                id="oldPassword"
                type="password"
                {...form.register("oldPassword")}
              />
              {form.formState.errors.oldPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.oldPassword.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                {...form.register("newPassword")}
              />
              {form.formState.errors.newPassword && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="newPasswordConfirm">Confirm Password</Label>
              <Input
                id="newPasswordConfirm"
                type="password"
                {...form.register("newPasswordConfirm")}
              />
              {form.formState.errors.newPasswordConfirm && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.newPasswordConfirm.message}
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:col-span-2">
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordForm;
