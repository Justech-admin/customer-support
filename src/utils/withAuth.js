import { useEffect } from "react";
import { useRouter } from "next/router";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const isAuthenticated = typeof window !== "undefined" && localStorage.getItem("token");

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null; // Prevent flickering
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
