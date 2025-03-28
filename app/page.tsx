"use client";
import { useSession } from "next-auth/react";
import { Suspense } from "react";
import { Nav } from "./components/Nav";
import { Table } from "./components/Table";

export default function SignIn() {
	const { data } = useSession();

	const name = data?.user?.name ?? "";
	const img = data?.user?.image ?? "";

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="main-container">
				<Nav name={name} img={img} />
				<main>
					<Table />
				</main>
			</div>
		</Suspense>
	);
}
