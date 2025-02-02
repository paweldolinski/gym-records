"use client";

import { Input } from "@/components/Input/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
	const [credentials, setCredentials] = useState({ email: "", password: "" });

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;
		setCredentials((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async () => {
		const signInResponse = await signIn("credentials", {
			email: credentials.email,
			password: credentials.password,
			redirect: false,
		});

		console.log(signInResponse, "-=-=");
	};

	return (
		<div className="login">
			<div className="login__form-wrapper">
				<Input name="email" onChange={handleInputChange} label="Email" />
				<Input name="password" onChange={handleInputChange} label="Password" />
				<button onClick={handleSubmit}>Zaloguj się</button>
				<p>
					Nie masz jeszcze konta? <Link href="/register">Zarejestruj się</Link>
				</p>
				<div className="login__separator">Albo</div>
				<button className="btn-google" onClick={() => signIn("google")}>
					Zaloguj się z Google
				</button>
			</div>
		</div>
	);
};

export default LoginPage;
