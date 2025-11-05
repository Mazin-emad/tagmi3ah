import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductForm from "@/components/forms/ProductForm";
import MetadataForm from "@/components/forms/MetadataForm";
import ProfileForm from "@/components/forms/ProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const Dashboard = () => {
  return (
    <main>
      <section className="grid max-w-screen-xl py-4 px-4 mx-auto gap-4 lg:gap-8 xl:gap-2 lg:py-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Admin Dashboard
        </h1>
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="product">
            <TabsList>
              <TabsTrigger value="product">Add New Product</TabsTrigger>
              <TabsTrigger value="metadata">Update Metadata</TabsTrigger>
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <ProductForm />
            </TabsContent>
            <TabsContent value="metadata">
              <MetadataForm />
            </TabsContent>
            <TabsContent value="profile">
              <ProfileForm />
            </TabsContent>
            <TabsContent value="password">
              <ChangePasswordForm />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
