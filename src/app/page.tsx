"use client";

import { Loader } from "@/components/loader";
import { getAuthToken } from "@/utils/getAuthToken";

export default function Home() {
  const handleLogin = async () => {
    window.location.href = "/api/toc/authenticate";
  };

  const { isLoading } = getAuthToken();

  return (
    <div className="flex items-center justify-center h-screen">
      {isLoading ? (
        <div className="w-1/2">
          <Loader />
        </div>
      ) : (
        <button onClick={handleLogin}>Olá!</button>
      )}
    </div>
  );
}
