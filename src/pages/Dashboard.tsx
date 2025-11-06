import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductForm from "@/components/forms/ProductForm";
import BrandsCategoriesForm from "@/components/forms/BrandsCategoriesForm";
import { BrandsTable, CategoriesTable } from "@/components/forms/BrandsCategoriesTable";
import ProfileForm from "@/components/forms/ProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const Dashboard = () => {
  return (
    <main>
      <section className="grid max-w-7xl py-4 px-4 mx-auto gap-4 lg:gap-8 xl:gap-2 lg:py-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Admin Dashboard
        </h1>
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="product">
            <TabsList className="flex w-full overflow-x-auto flex-nowrap justify-start sm:justify-center gap-2 rounded-md p-1">
              <TabsTrigger value="product" className="shrink-0 px-3 py-2 text-sm sm:text-base">
                Add New Product
              </TabsTrigger>
              <TabsTrigger value="metadata" className="shrink-0 px-3 py-2 text-sm sm:text-base">
                Brands & Categories
              </TabsTrigger>
              <TabsTrigger value="profile" className="shrink-0 px-3 py-2 text-sm sm:text-base">
                Update Profile
              </TabsTrigger>
              <TabsTrigger value="password" className="shrink-0 px-3 py-2 text-sm sm:text-base">
                Change Password
              </TabsTrigger>
            </TabsList>
            <TabsContent value="product">
              <ProductForm />
            </TabsContent>
            <TabsContent value="metadata">
              <div className="grid gap-6">
                <BrandsCategoriesForm />
                <div className="grid md:grid-cols-2 gap-6">
                  <BrandsTable />
                  <CategoriesTable />
                </div>
              </div>
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
