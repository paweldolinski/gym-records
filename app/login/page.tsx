"use client";

import Card from "@/components/Card";
import { Input } from "@/components/Input/input";
import { Nav } from "@/components/Nav";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
	const [credentials, setCredentials] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;

		setCredentials((prev) => ({ ...prev, [name]: value }));
		setError("");
	};

	const handleCredetnialsLogin = async () => {
		const { email, password } = credentials;

		if (!email) {
			setError("Podaj email");
			return;
		}

		if (!password) {
			setError("Hasło jest wymagane");
			return;
		}

		signIn("credentials", {
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
						{error ? <p>{error}</p> : null}
						<Input name="email" onChange={handleInputChange} label="Email" />
						<Input
							name="password"
							onChange={handleInputChange}
							label="Password"
							type="password"
						/>
						<button onClick={handleCredetnialsLogin}>Zaloguj się</button>
						<p>
							Nie masz jeszcze konta?{" "}
							<Link href="/register">Zarejestruj się</Link>
						</p>
						<div className="login__separator">Albo</div>
						<button
							className="btn-google"
							onClick={handleGoogleLogin}
							disabled={error ? true : false}
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
