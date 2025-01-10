"use client";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import type { UsersData } from "./types";
import { OwnerButtons } from "./OwnerButtons";
import { AdminButtons } from "./AdminButtons";
import FallbackImg from "../../assets/9dca345c5519d191af167abedf3b76ac.jpg";
import { ImageWithFallback } from "../Image";
import type { Record } from "./types";

interface RowTableProps extends UsersData {
	setData: Dispatch<SetStateAction<UsersData[] | null>>;
	handleUserAction: (id: string, actionType: "approve" | "reject") => void;
}

export const RowTable = ({
	name,
	records,
	_id,
	setData,
	approved,
	handleUserAction,
	img,
}: RowTableProps) => {
	const { data } = useSession();
	const [isEdit, setIsEdit] = useState(false);
	const [inputData, setInputData] = useState<Record[]>([
		{ exercise: "squat", classic: "", gear: "" },
		{ exercise: "press", classic: "", gear: "" },
		{ exercise: "lift", classic: "", gear: "" },
	]);

	const isOwner = data?.user?.id === _id;
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
				body: JSON.stringify({ id: _id, records: inputData }),
			});

			const {
				user: { records },
				message,
			} = await response.json();
			console.log(message);

			setData((prev) =>
				prev
					? prev?.map((user) =>
							user._id === _id ? { ...user, records: records } : user,
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
			<div className={`table__cells-wrapper ${isEdit ? "active" : ""}`}>
				<div className="table__cell" data-type="user">
					<ImageWithFallback
						src={img}
						fallbackSrc={FallbackImg.src}
						width={25}
						height={25}
						alt="avatar"
					/>
					<span className="table__user-name">{name}</span>
				</div>
				<div
					className={`table__status table__cell ${approved ? "approved" : ""}`}
				>
					&#10004;
				</div>

				{inputData.map(({ exercise, classic, gear }) => (
					<div className="table__cell" key={exercise}>
						<input
							className="table__cell--input"
							placeholder="Klasyk"
							onChange={(e) => handleInputChange(e, exercise, "classic")}
							value={classic}
							disabled={!isEdit}
							name={exercise}
							data-type="classic"
						/>
						<input
							className="table__cell--input"
							placeholder="Sprzęt"
							onChange={(e) => handleInputChange(e, exercise, "gear")}
							value={gear}
							disabled={!isEdit}
							name={exercise}
							data-type="gear"
						/>
					</div>
				))}
			</div>
			{isOwner && !isAdmin ? (
				<OwnerButtons setIsEdit={setIsEdit} isEdit={isEdit} onSave={onSave} />
			) : null}
			{isAdmin ? (
				<AdminButtons
					onApprove={() => handleUserAction(_id, "approve")}
					setIsEdit={setIsEdit}
					isEdit={isEdit}
					onSave={onSave}
				/>
			) : null}
		</div>
	);
};
