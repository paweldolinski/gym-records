"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Nav } from "./components/Nav";
import { Loader } from "./components/Loader";

export default function SignIn() {
	const { status, data } = useSession();

	return (
		<div>
			<main>
				<Nav name={data?.user ? data.user.email : null} />
				<h1>Home, hello</h1>
			</main>
		</div>
	);
}
