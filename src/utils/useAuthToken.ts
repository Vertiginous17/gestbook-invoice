import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Track loading state
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/toc/userinfo", {
          method: "GET",
          credentials: "include", // Make sure to include cookies
        });

        const data = await res.json();

        if (data.token) {
          setToken(data.token); // Store token in state
          toast("Login feito com sucesso");
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/login");
      } finally {
        setIsLoading(false); // Stop loading once the request completes
      }
    };

    fetchData();
  }, [router]); // Dependency array to only rerun the effect if `router` changes

  return { token, isLoading }; // Return both token and loading state
};
