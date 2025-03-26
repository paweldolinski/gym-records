"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
	user_not_found: "Użytkownik o podanym adresie email nie istnieje.",
	wrong_password: "Podano nieprawidłowe hasło.",
	user_not_verified: "Sprawdź skrzynkę email w celu weryfikacji konta",
	default: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
};

export default function ErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error");

	console.log(error);

	const errorMessage = errorMessages[error || "default"];

	return (
		<div className="error">
			<h1>Błąd logowania</h1>
			<p>{errorMessage}</p>
			<Link href="/api/auth/signin">Powrót do logowania</Link>
		</div>
	);
}
