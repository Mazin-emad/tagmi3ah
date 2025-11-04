import { useMe } from "@/hooks";
import { ErrorPage } from "../global/ErrorComponents";
import { LoadingPage } from "../global/LoadingComponents";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const NotAuthenticatedOnly = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isError, error } = useMe();

  if (isLoading) return <LoadingPage message="Loading user data..." />;
  if (isError)
    return <ErrorPage message={error?.message || "An error occurred"} />;

  if (user) {
    toast.error("You Have To Be Logged Out To Access This Page");
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default NotAuthenticatedOnly;
