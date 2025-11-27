"use client";

import Card from "@/components/Card";
import { Input } from "@/components/Input/input";
import { Nav } from "@/components/Nav";
import { signIn } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCredentialsLogin = async () => {
    const { email, password } = credentials;

    if (!email) {
      setError("Podaj email");
      return;
    }

    if (!password) {
      setError("Hasło jest wymagane");
      return;
    }

    await signIn("credentials", {
      email: credentials.email,
      password: credentials.password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { redirect: true, callbackUrl: "/" });
  };

  return (
    <>
      <Nav />
      <Card>
        <div className="login">
          <div className="login__form-wrapper">
            {error ? <p className="login__error">{error}</p> : null}
            <Input
              type="text"
              name="email"
              onChange={handleInputChange}
              label="Email"
              value={credentials.email}
            />
            <Input
              name="password"
              onChange={handleInputChange}
              label="Password"
              type="password"
              value={credentials.password}
            />
            <button type="button" onClick={handleCredentialsLogin}>
              Zaloguj się
            </button>
            <p>
              Nie masz jeszcze konta?{" "}
              <Link href="/register">Zarejestruj się</Link>
            </p>
            <div className="login__separator">Albo</div>
            <button
              type="button"
              className="btn-google"
              onClick={handleGoogleLogin}
              disabled={!!error}
            >
              Zaloguj się z Google
            </button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default LoginPage;
