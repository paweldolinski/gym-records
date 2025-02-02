"use client";

import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
	user_not_found: "Użytkownik o podanym adresie email nie istnieje.",
	wrong_password: "Podano nieprawidłowe hasło.",
	default: "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
};

export default function ErrorPage() {
	const searchParams = useSearchParams();
	const error = searchParams.get("error"); // Pobranie parametru "error" z URL

	console.log(error);

	const errorMessage = errorMessages[error || "default"];

	return (
		<div className="error">
			<h1>Błąd logowania</h1>
			<p>{errorMessage}</p>
			<a href="/api/auth/signin">Powrót do logowania</a>
		</div>
	);
}
