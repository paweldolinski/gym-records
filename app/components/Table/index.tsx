import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { Loader } from "../Loader";
import { HeaderTable } from "./HeaderTable";
import { RowTable } from "./RowTable";
import type { UsersData } from "./types";

interface SortingExercise {
	exercise: "lift" | "squat" | "press";
	type: "classic" | "gear";
}

const getUsers = async (
	setData: React.Dispatch<React.SetStateAction<UsersData[] | null>>,
	setLoading: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<void> => {
	try {
		const res = await fetch("/api/users", { method: "GET" });

		if (!res.ok) {
			throw new Error("Błąd podczas pobierania danych użytkowników");
		}
		const data: UsersData[] = await res.json();

		setData(data);
	} catch (error) {
		console.error(error);
		alert("Nie udało się załadować danych użytkowników");
	} finally {
		setLoading(false);
	}
};

export const Table = () => {
	const [data, setData] = useState<UsersData[] | null>(null);
	const [sortedData, setSortedData] = useState<UsersData[] | null>(null);
	const [sortingExercise, setSortingExercise] = useState<SortingExercise>({
		exercise: "press",
		type: "classic",
	});
	const [isLoading, setLoading] = useState(true);
	const { status } = useSession();
	const isGuest = status === "unauthenticated";

	const sortingData = useCallback(() => {
		if (!data) return;
		const sortedData = [...(data || [])]?.sort((a, b) => {
			const aValue =
				a.records.find(
					(record) => record.exercise === sortingExercise.exercise,
				)?.[sortingExercise.type] || "0";

			const bValue =
				b.records.find(
					(record) => record.exercise === sortingExercise.exercise,
				)?.[sortingExercise.type] || "0";

			return Number.parseInt(bValue) - Number.parseInt(aValue);
		});

		setSortedData(sortedData);
	}, [data, sortingExercise]);

	const setSortingExerciseAndType = (
		event: React.MouseEvent<HTMLDivElement>,
	) => {
		const { name, type } = event.currentTarget.dataset;
		if (!name || !type) return;

		const obj = {
			exercise: name as "lift" | "squat" | "press",
			type: type as "classic" | "gear",
		};
		setSortingExercise(obj);
	};

	const handleUserAction = async (
		id: string,
		actionType: "approve" | "reject",
	) => {
		setLoading(true);

		try {
			const { status } = await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify({ type: actionType, id }),
			});

			if (status !== 201) {
				throw new Error("Nie udało się zaktualizować użytkownika");
			}

			getUsers(setData, setLoading);
		} catch (error) {
			console.error(error);
			alert("Wystąpił błąd podczas aktualizacji użytkownika");
		}
	};

	useEffect(() => {
		getUsers(setData, setLoading);
	}, []);

	useEffect(() => {
		if (sortingExercise.exercise && sortingExercise.type) {
			sortingData();
		}
	}, [sortingExercise.exercise, sortingExercise.type, sortingData]);

	console.log(data);

	return isLoading ? (
		<Loader />
	) : (
		<div className={`table container ${isGuest ? "center" : null}`}>
			<div className="table__table-wrapper">
				<HeaderTable setSortingExerciseAndType={setSortingExerciseAndType} />
				{(sortedData || data)?.map(
					({ records, _id, name, email, approved, img, isEmailVerified }) =>
						isEmailVerified ? (
							<RowTable
								name={name}
								email={email}
								records={records}
								key={_id}
								_id={_id}
								setData={setData}
								handleUserAction={handleUserAction}
								approved={approved}
								img={img}
							/>
						) : null,
				)}
			</div>
		</div>
	);
};
