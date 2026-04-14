"use client";

import type React from "react";
import { useState } from "react";
import Card from "@/components/Card";
import { Input } from "@/components/Input/input";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";

type ErrorsType = {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  terms?: boolean;
  consent?: boolean;
};

type FormDataType = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: boolean;
  consent?: boolean;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorsType | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (formData: FormDataType) => {
    const errors: Record<string, boolean | string> = {};
    const namePattern =
      "^(?=(?:.*[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]){3,})[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż ]+$";
    const nameRegex = new RegExp(namePattern);

    if (formData?.name && !nameRegex.test(formData?.name)) {
      errors.name = true;
    }

    Object.entries(formData).forEach(([k, v]) => {
      if (v === "" || v === false) {
        errors[k] = true;
      }
    });
    setErrors(errors);
    console.log(Object.keys(errors).length === 0, errors, "test");

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validateForm = validate(formData);

    if (!validateForm) {
      return;
    }

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Wszystkie pola są wymagane!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          terms: true,
        }),
      });

      if (response.ok) {
        setError(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
        setIsLoading(false);
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Wystąpił błąd podczas rejestracji.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Nie udało się nawiązać połączenia z serwerem.");
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="register">
      <Nav />
      <Card>
        <h1>Rejestracja</h1>
        {error && <p>{error}</p>}
        {success ? (
          <p>
            Rejestracja zakończona sukcesem! <br /> Sprawdź maila w celu
            weryfikacji konta
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Input
              name="name"
              placeholder="Imię"
              type="text"
              required={true}
              onChange={handleChange}
              errorMsg="Imię może składać się tylko z liter i musi mieć przynajmniej 3 znaki"
              pattern="^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż ]+$"
              value={formData.name}
              error={errors?.name}
            />
            <Input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required={true}
              value={formData.email}
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              errorMsg="Podaj email w poprawnym formacie"
              error={errors?.email}
            />
            <Input
              type="password"
              name="password"
              onChange={handleChange}
              required={true}
              value={formData.password}
              placeholder="Hasło"
              error={errors?.password}
            />
            <Input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              required={true}
              value={formData.confirmPassword}
              errorMsg={"Hasła nie są takie same."}
              pattern={`^${formData?.password?.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`}
              placeholder="Powtórz hasło"
              error={errors?.confirmPassword}
            />
            <Input
              name="terms"
              type="checkbox"
              checked={formData.terms}
              onChange={handleChange}
              required={true}
              errorMsg="Zgoda jest wymagana."
              error={errors?.terms}
              label="Akceptuję Regulamin i zapoznałem/am się z Polityką Prywatności."
              variant="register__terms"
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Rejestracja..." : "Zarejestruj się"}
            </button>
          </form>
        )}
      </Card>
      {isLoading ? <Loader /> : null}
    </div>
  );
}
