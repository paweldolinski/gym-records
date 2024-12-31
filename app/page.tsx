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
	const onSubmit = (e) => {
		e.preventDefault();
		console.log("elo", e);
	};

	return (
		<div>
			<main>
				<Nav name={data?.user ? data.user.email : null} openEdit={setIsEdit} />
				<Table />
			</main>
		</div>
	);
}
