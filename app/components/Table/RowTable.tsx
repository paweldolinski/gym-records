"use client";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { UsersData } from "./index";
import { OwnerButtons } from "./OwnerButtons";
import { AdminButtons } from "./AdminButtons";
interface RecordsProps {
	exercise: string;
	classic: string;
	gear: string;
}

interface RowTableProps {
	email?: string;
	records: RecordsProps[];
	name: string;
	id: string;
	isOwner: boolean;
	setData: Dispatch<SetStateAction<UsersData[] | null>>;
	approved: boolean;
	handleUserAction: (id: string, actionType: "approve" | "reject") => void;
}

export const RowTable = ({
	name,
	records,
	id,
	email,
	setData,
	approved,
	handleUserAction,
}: RowTableProps) => {
	const [isEdit, setIsEdit] = useState(false);
	const [inputData, setInputData] = useState<RecordsProps[]>([
		{ exercise: "squat", classic: "", gear: "" },
		{ exercise: "press", classic: "", gear: "" },
		{ exercise: "lift", classic: "", gear: "" },
	]);

	const { data } = useSession();
	const isOwner = data?.user?.id === id;
	const isAdmin = data?.user?.isAdmin;

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		exercise: string,
		type: "classic" | "gear",
	) => {
		const { value } = e.target;

		setInputData((prev) =>
			prev.map((item) =>
				item.exercise === exercise ? { ...item, [type]: value } : item,
			),
		);
	};

	const onSave = async () => {
		setIsEdit(false);

		console.log("onSave");

		try {
			const response = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify({ id: id, records: inputData }),
			});

			const {
				user: { records },
				message,
			} = await response.json();
			console.log(message);

			setData((prev) =>
				prev
					? prev?.map((user) =>
							user._id === id ? { ...user, records: records } : user,
						)
					: null,
			);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		setInputData(
			records.map(({ exercise, classic, gear }) => ({
				exercise,
				classic: classic || "",
				gear: gear || "",
			})),
		);
	}, [records]);

	return (
		<div className="table__row-wrapper">
			<div className={`table__badge ${approved ? "approved" : ""}`}>
				&#10004;
			</div>
			<div className={`table__cells-wrapper ${isEdit ? "active" : ""}`}>
				<div className="table__cell" data-type="user">
					{name}
				</div>
				{inputData.map(({ exercise, classic, gear }) => (
					<div className="table__cell" key={exercise}>
						<input
							className="table__cell--input"
							placeholder="Classic"
							onChange={(e) => handleInputChange(e, exercise, "classic")}
							value={classic}
							disabled={!isEdit}
							name={exercise}
							data-type="classic"
						/>
						<input
							className="table__cell--input"
							placeholder="Gear"
							onChange={(e) => handleInputChange(e, exercise, "gear")}
							value={gear}
							disabled={!isEdit}
							name={exercise}
							data-type="gear"
						/>
					</div>
				))}
			</div>
			{isOwner ? (
				<OwnerButtons setIsEdit={setIsEdit} isEdit={isEdit} onSave={onSave} />
			) : null}
			{isAdmin ? (
				<AdminButtons
					onApprove={() => handleUserAction(id, "approve")}
					onReject={() => handleUserAction(id, "reject")}
				/>
			) : null}
		</div>
	);
};
