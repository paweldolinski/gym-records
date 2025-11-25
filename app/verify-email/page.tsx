"use client";

import Card from "@/components/Card";
import { Loader } from "@/components/Loader";
import { newVerification } from "@/utilities/newVerification";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
        const response = await newVerification(token);
        const { success, error } = response || {};

        setMessage(success || error || "Verification failed");
        if (success) {
          setSuccess(true);
        } else {
          setSuccess(false);
        }
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
