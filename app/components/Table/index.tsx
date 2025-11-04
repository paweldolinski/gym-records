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

	const fetchUsers = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users", { method: "GET"});

			if (!res.ok) throw new Error("Błąd podczas pobierania danych użytkowników");

			const json: UsersData[] = await res.json();

			setData(json ?? []);
		} catch (err) {
				console.error(err);
				throw new Error("Nie udało się załadować danych użytkowników")
		} finally {
			setLoading(false);
		}

	}, []);

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

			console.log(aValue, bValue)

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


	const handleUserAction = useCallback(
		async (id: string, actionType: "approve") => {
			setLoading(true);

			try {
				const res = await fetch("/api/users", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ type: actionType, id }),
				});
				if (res.status !== 201) throw new Error("Nie udało się zaktualizować użytkownika");
				await fetchUsers();
			} catch (err) {
				console.error(err);
				setLoading(false);
				throw new Error("Nie udało się zaktualizować użytkownika");
			}
		},
		[fetchUsers],
	);

	useEffect(() => {
		(async () => {
			await fetchUsers()
		})();
	}, [fetchUsers]);

	useEffect(() => {
		if (sortingExercise.exercise && sortingExercise.type) {
			sortingData();
		}
	}, [sortingExercise.exercise, sortingExercise.type, sortingData]);

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
								setDataAction={setData}
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
