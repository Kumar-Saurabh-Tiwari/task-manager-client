// hooks/useAuth.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log("Token:", token);
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      router.replace("/login"); // Redirect to login if no token
    } else {
      // Optionally validate the token here
      setIsAuthenticated(true);
      setIsLoading(false);
    }
  }, [router]);

  return { isAuthenticated, isLoading };
};
