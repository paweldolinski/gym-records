"use client";
import { useSession } from "next-auth/react";
import { Nav } from "./components/Nav";
import { Table } from "./components/Table";

export default function SignIn() {
	const { data } = useSession();

	const name = data?.user?.name ?? "";
	const img = data?.user?.image ?? "";
	const id = data?.user?.id;
	console.log(data, "asd", img);

	return (
		<div className="main-container">
			<Nav name={name} img={img} id={id} />
			<main>
				<Table />
			</main>
		</div>
	);
}
