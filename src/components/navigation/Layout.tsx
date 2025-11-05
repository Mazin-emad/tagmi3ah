import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Layout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-140px)]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  );
};

export default Layout;
