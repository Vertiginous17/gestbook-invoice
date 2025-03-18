"use client";

import { Loader } from "@/components/loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const handleLogin = async () => {
    window.location.href = "/api/toc/authenticate";
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const res = await fetch("/api/toc/userinfo", {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (data.token) {
        toast("Login feito com sucesso");
      } else router.push("/login");
    };

    fetchData();
    setIsLoading(false);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      {isLoading ? (
        <div className="w-1/2">
          <Loader />
        </div>
      ) : (
        <button onClick={handleLogin}>Conectar com TOC Online</button>
      )}
    </div>
  );
}
