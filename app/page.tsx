"use client";

import styles from "./page.module.css";
import { signIn } from "next-auth/react";
const GithubSignInButton = () => {
	const handleClick = (): void => {
		signIn("github");
	};

	return (
		<button type="button" onClick={handleClick}>
			<span>Continue with Github</span>
		</button>
	);
};

export default function SignIn() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Home</h1>
				<GithubSignInButton />
			</main>
		</div>
	);
}
