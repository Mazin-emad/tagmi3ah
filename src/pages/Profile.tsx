import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProfileForm from "@/components/forms/ProfileForm";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

const Profile = () => {
  return (
    <main>
      <section className="grid max-w-screen-xl py-4 px-4 mx-auto gap-4 lg:gap-8 xl:gap-2 lg:py-8">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          Profile
        </h1>
        <div className="flex flex-col gap-4">
          <Tabs defaultValue="profile">
            <TabsList>
              <TabsTrigger value="profile">Update Profile</TabsTrigger>
              <TabsTrigger value="password">Change Password</TabsTrigger>
            </TabsList>
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

export default Profile;
