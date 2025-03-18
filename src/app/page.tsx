"use client";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import { useAuthToken } from "@/utils/useAuthToken";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { isLoading } = useAuthToken();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-muted">
        <div className="w-1/3">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Bem-vindo
        </h1>
        <p className="text-gray-600 text-center text-lg">
          Podes submmeter aqui as faturas de forma simples e automatizada.
        </p>

        <div className="flex justify-center">
          <Button
            onClick={() => router.push("/submeter-faturas")}
            size="lg"
            className="text-lg px-8 py-6"
          >
            Submeter Faturas 🚀
          </Button>
        </div>
        <div className="flex items-center justify-center">
          <p className="text-sm text-gray-400">Em caso de dúvidas,</p>
          <Link
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"
            target="_blank"
            className="text-sm text-gray-700"
          >
            contacta-nos.
          </Link>
        </div>
      </div>
    </main>
  );
}
