"use client";

import Card from "@/components/Card";
import { Input } from "@/components/Input/input";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { useState } from "react";

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, pattern } = e.target;
		console.log(pattern);

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	console.log(error, formData);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

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
			const response = await fetch("/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
					type: "register",
				}),
			});

			if (response.ok) {
				setError(null);
				setFormData({
					name: "",
					email: "",
					password: "",
					confirmPassword: "",
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
					<form onSubmit={handleSubmit}>
						<Input
							name="name"
							placeholder="Imię"
							type="text"
							required={true}
							onChange={handleChange}
							errorMsg="Imię może składać się tylko z liter i musi mieć przynajmniej 3 znaki"
							pattern="^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż ]+$"
							value={formData.name}
						/>
						<Input
							type="email"
							name="email"
							onChange={handleChange}
							required={true}
							value={formData.email}
							pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
							errorMsg="Podaj email w poprawnym formacie"
						/>
						<Input
							type="password"
							name="password"
							onChange={handleChange}
							required={true}
							value={formData.password}
						/>
						<Input
							type="password"
							name="confirmPassword"
							onChange={handleChange}
							required={true}
							value={formData.confirmPassword}
							errorMsg={"Hasła nie są takie same."}
							pattern={`^${formData.password.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")}$`}
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
