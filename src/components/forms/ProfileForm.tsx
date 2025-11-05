import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useMe, useUpdateMe } from "@/hooks";
import { useEffect } from "react";
import { ErrorPage } from "@/components/global/ErrorComponents";
import { LoadingPage } from "@/components/global/LoadingComponents";

const FormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof FormSchema>;

export default function ProfileForm() {
  const { data: user, isLoading, isError, error } = useMe();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Update form when user data is loaded
  useEffect(() => {
    if (user && !isLoading && !isError) {
      form.setValue("name", user.name || "");
      form.setValue("phoneNumber", user.phoneNumber || "");
      form.setValue("address", user.address || "");
    }
  }, [user, form, isLoading, isError]);

  if (isLoading) return <LoadingPage message="Loading user data..." />;
  if (isError) return <ErrorPage message={error?.message || "An error occurred"} />;

  const onSubmit = (data: ProfileFormData) => {
    updateMe(
      {
        name: data.name,
        phoneNumber: data.phoneNumber || undefined,
        address: data.address || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully!");
        },
        onError: (error) => {
          toast.error(
            error?.message || "Failed to update profile. Please try again."
          );
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>
          Update your profile information. Click Save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="profile-name">Name</Label>
              <Input
                id="profile-name"
                type="text"
                placeholder="John Doe"
                {...form.register("name")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profile-phoneNumber">Phone Number</Label>
              <Input
                id="profile-phoneNumber"
                type="text"
                placeholder="+20 123 456 7890"
                {...form.register("phoneNumber")}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="profile-address">Address</Label>
              <Input
                id="profile-address"
                type="text"
                placeholder="Enter your address"
                {...form.register("address")}
              />
            </div>
            <div>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

