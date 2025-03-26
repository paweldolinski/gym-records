"use client";

import Card from "@/components/Card";
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
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			setError("Hasła nie są takie same.");
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
				{success && (
					<p>
						Rejestracja zakończona sukcesem! <br /> Sprawdź maila w celu
						weryfikacji konta
					</p>
				)}
				{isLoading && <p>loading</p>}
				<form onSubmit={handleSubmit}>
					<input
						placeholder="Imię"
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
					/>

					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
					/>

					<input
						type="password"
						id="password"
						name="password"
						value={formData.password}
						onChange={handleChange}
						required
					/>

					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={formData.confirmPassword}
						onChange={handleChange}
						required
					/>
					<button type="submit" disabled={isLoading}>
						{isLoading ? "Rejestracja..." : "Zarejestruj się"}
					</button>
				</form>
			</Card>
		</div>
	);
}
