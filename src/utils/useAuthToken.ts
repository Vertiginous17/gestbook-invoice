import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState<boolean>(true); // Track loading state
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
          setToken(data.token);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        router.push("/login");
      } finally {
        setIsLoadingToken(false); // Stop loading once the request completes
      }
    };

    fetchData();
  }, [router]); // Dependency array to only rerun the effect if `router` changes

  return { token, isLoadingToken }; // Return both token and loading state
};
