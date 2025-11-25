"use client";

import { useSearchParams } from "next/navigation";
import type React from "react";
import { useState } from "react";
import Card from "@/components/Card";
import { Input } from "@/components/Input/input";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";

export default function Onboarding() {
  const [formData, setFormData] = useState({
    terms: false,
    healthConsent: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<object>({
    terms: false,
    healthConsent: false,
  });
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const validate = (formData) => {
    const errors: object = {};

    Object.entries(formData).forEach(([k, v]) => {
      if (v === "" || v === false) {
        errors[k] = true;
      }
    });
    setErrors(errors);
    console.log(Object.keys(errors).length === 0, errors, "errors");

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validateForm = validate(formData);

    if (!validateForm) return;
    if (!id) return;
    console.log(formData, "asd");

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          data: {
            terms: true,
            healthConsent: true,
            termsAndHealthConsentTimestamp: new Date(),
          },
          type: "profileUpdate",
        }),
      });

      if (response.ok) {
        setError(null);
        setSuccess(true);
        setIsLoading(false);
      } else {
        const data = await response.json();
        setError(data.message || "Wystąpił błąd podczas aktualizacji zgód.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Nie udało się nawiązać połączenia z serwerem.");
      setIsLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="onboarding">
      <Nav />
      <Card>
        <h1>Zogdy</h1>
        {error && <p>{error}</p>}
        {success ? (
          <p>Zrobione !</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
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

            <Input
              name="healthConsent"
              type="checkbox"
              checked={formData.healthConsent}
              onChange={handleChange}
              required={true}
              errorMsg="Zgoda jest wymagana."
              error={errors?.healthConsent}
              label="Wyrażam wyraźną zgodę na przetwarzanie moich rekordów (bench/squat/deadlift) w celu prowadzenia i prezentacji mojego profilu w aplikacji. Zgodę mogę wycofać w każdej chwili."
              variant="register__terms"
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Wysyłam..." : "Wyślij"}
            </button>
          </form>
        )}
      </Card>
      {isLoading ? <Loader /> : null}
    </div>
  );
}
