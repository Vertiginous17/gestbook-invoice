"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { auth, signInWithEmailAndPassword } from "@/lib/firebase";
import { LoaderMiddlePage } from "@/components/loader/loaderMiddlePage";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      // Use Firebase Authentication to sign in the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      // If login is successful, you can proceed with the backend flow
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.email, password }),
      });

      if (res.redirected) {
        // Redirect handled by the backend
        window.location.href = res.url;
      } else {
        const data = await res.json();
        setError(data.message);
        setIsLoading(false);
      }
    } catch (error: unknown) {
      setError("Invalid username or password.");
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen relative">
      {isLoading && <LoaderMiddlePage />}
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Username input */}
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="email" // Username will be treated as email
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* Password input */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Show error if there's any */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button className="w-full" type="submit">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
