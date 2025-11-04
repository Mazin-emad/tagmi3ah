import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const FormSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  address: z.string(),
});

const Profile = () => {
  const { data: user, isLoading, isError, error } = useMe();
  const { mutate: updateMe, isPending: isUpdating } = useUpdateMe();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      address: "",
    },
  });

  // Update form when metadata is loaded
  useEffect(() => {
    if (user && !isLoading && !isError) {
      form.setValue("name", user.name || "");
      form.setValue("phoneNumber", user.phoneNumber || "");
      form.setValue("address", user.address || "");
    }
  }, [user, form, isLoading, isError]);

  if (isLoading) return <LoadingPage message="Loading user data..." />;
  if (isError) return <ErrorPage message={error.message} />;

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    // Parse comma-separated strings into arrays
    updateMe(
      {
        name: data.name,
        phoneNumber: data.phoneNumber,
        address: data.address,
      },
      {
        onSuccess: () => {
          toast.success("User updated successfully!");
        },
        onError: (error) => {
          toast.error(
            error?.message || "Failed to update User. Please try again."
          );
        },
      }
    );
  };
  return (
    <main>
      <section className="grid max-w-screen-xl py-4 px-4 mx-auto gap-4 lg:gap-8 xl:gap-2 lg:py-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Profile
        </h1>
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="password">
            <TabsList>
              <TabsTrigger value="password">Change Password</TabsTrigger>
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <ChangePasswordForm />
            </TabsContent>
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Update Profile</CardTitle>
                  <CardDescription>
                    Update your profile information. Click Save when logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="grid gap-6"
                    >
                      <div className="grid gap-3">
                        <Label htmlFor="tabs-demo-categories">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          {...form.register("name")}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          type="text"
                          placeholder="01234567890"
                          {...form.register("phoneNumber")}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="1234567890"
                          className="resize-none"
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
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Profile;
