"use client";
import { useSession } from "next-auth/react";
import { Nav } from "./components/Nav";
import { Table } from "./components/Table";
import { useState } from "react";
import { Modal } from "./components/Modal";

export default function SignIn() {
	const [isEdit, setIsEdit] = useState(false);
	const { status, data, update } = useSession();
	console.log(data);

	const name = data?.user?.email ?? "";
	const img = data?.user?.image ?? "";

	return (
		<div>
			<main>
				<Nav name={name} img={img} />
				<Table />
			</main>
		</div>
	);
}
