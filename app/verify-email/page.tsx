"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Card from "@/components/Card";
import { Loader } from "@/components/Loader";

const VerifyEmailFormContent = () => {
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean | null>(null);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setMessage("No token provided");
        return;
      }

      console.log("Verifying with token:", token);

      try {
        const response = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();
        const success = data?.success === true;
        const message = success ? data?.data?.message : data?.message || "Verification failed";

        setMessage(message);
        setSuccess(success);
      } catch (error) {
        console.error("Error in verification:", error);
        setMessage(`An unexpected error occurred ${error}`);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="verify-email">
      <Card>
        {message ? (
          <>
            <h1>{message}</h1>
            <br />
            <Link href="/">Tabela</Link>
            <br />
            <br />
          </>
        ) : (
          <Loader />
        )}
        {success ? (
          <>
            Możesz teraz <Link href="/login">zalogować</Link> się do portalu
          </>
        ) : null}
      </Card>
    </div>
  );
};

const VerifyEmailForm = () => {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmailFormContent />
    </Suspense>
  );
};

export default VerifyEmailForm;
