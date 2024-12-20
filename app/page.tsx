"use client";
import { useSession } from "next-auth/react";
import { Nav } from "./components/Nav";
import { Table } from "./components/Table";

export default function SignIn() {
	const { status, data, update } = useSession();
	console.log(data);

	return (
		<div>
			<main>
				<Nav name={data?.user ? data.user.email : null} />
				<Table />
			</main>
		</div>
	);
}
