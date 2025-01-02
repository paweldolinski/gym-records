"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Buttons } from "./Buttons";

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
}

export const RowTable = ({ name, records, id, email }: RowTableProps) => {
	const [isEdit, setIsEdit] = useState(false);
	const [inputData, setInputData] = useState<RecordsProps[]>([
		{ exercise: "squat", classic: "", gear: "" },
		{ exercise: "press", classic: "", gear: "" },
		{ exercise: "lift", classic: "", gear: "" },
	]);

	const { data } = useSession();
	const isOwner = data?.user.id === id;

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

		try {
			const response = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify({ id: id, records: inputData }),
			});

			const json = await response.json();

			console.log(json);
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
			<div className="table__cells-wrapper">
				<div className="table__cell" data-type="user">
					{email}
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
				<Buttons setIsEdit={setIsEdit} isEdit={isEdit} onSave={onSave} />
			) : null}
		</div>
	);
};
