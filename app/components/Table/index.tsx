import { useCallback, useEffect, useState } from "react";
import { HeaderTable } from "./HeaderTable";
import { RowTable } from "./RowTable";
import { Loader } from "../Loader";

interface Record {
	exercise: string;
	classic: string;
	gear: string;
	_id: string;
}

interface UsersData {
	email?: string;
	records: Record[];
	name: string;
	_id: string;
}

interface SortingExercise {
	exercise: "lift" | "squad" | "press";
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

	const sortingData = useCallback(() => {
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
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		const { name, type } = event.currentTarget.dataset;
		if (!name || !type) return;

		const obj = {
			exercise: name as "lift" | "squad" | "press",
			type: type as "classic" | "gear",
		};
		setSortingExercise(obj);
	};

	useEffect(() => {
		fetch("/api/users", { method: "GET" })
			.then((res) => res.json())
			.then((data: UsersData[]) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	useEffect(() => {
		if (sortingExercise.exercise && sortingExercise.type) {
			sortingData();
		}
	}, [sortingExercise.exercise, sortingExercise.type, sortingData]);

	return isLoading ? (
		<Loader />
	) : (
		<div className="table">
			<HeaderTable setSortingExercise={setSortingExerciseAndType} />
			{(sortedData || data)?.map(({ records, _id, name, email }) => (
				<RowTable
					name={name}
					email={email}
					records={records}
					key={_id}
					id={_id}
					isOwner={true}
				/>
			))}
		</div>
	);
};
