"use client";

import Card from "@/components/Card";
import { Loader } from "@/components/Loader";
import { newVerification } from "@/utilities/newVerification";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Komponent do obsługi formularza weryfikacji email
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

			try {
				const { success, error } = (await newVerification(token)) || {};
				setMessage(success || error || "Verification failed");
				if (success) {
					setSuccess(true);
				} else {
					setSuccess(false);
				}
			} catch (error) {
				console.error(error);
				setMessage("An unexpected error occurred");
			}
		};

		verifyEmail();
	}, [token]);

	return (
		<div className="verify-email">
			<Card>
				{message ? <h1>{message}</h1> : <Loader />}
				{success ? (
					<>
						Możesz teraz <Link href="/login">zalogować</Link> się do portalu
					</>
				) : null}
			</Card>
		</div>
	);
};

// Komponent opakowany w Suspense
const VerifyEmailForm = () => {
	return (
		<Suspense fallback={<div>Ładowanie...</div>}>
			<VerifyEmailFormContent />
		</Suspense>
	);
};

export default VerifyEmailForm;
