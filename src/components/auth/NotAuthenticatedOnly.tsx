import { useMe } from "@/hooks";
import { LoadingPage } from "../global/LoadingComponents";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const NotAuthenticatedOnly = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return <LoadingPage message="Loading user data..." />;

  if (user) {
    toast.warning("You Have To Be Logged Out To Access This Page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NotAuthenticatedOnly;
