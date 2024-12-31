import { useEffect, useState } from "react";
import { HeaderTable } from "./HeaderTable";
import { RowTable } from "./RowTable";
import { Loader } from "../Loader";

interface UsersData {
	email?: string;
	records: [];
	name: string;
	_id: string;
}

export const Table = () => {
	const [data, setData] = useState<UsersData[] | null>(null);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/users", { method: "GET" })
			.then((res) => res.json())
			.then((data: UsersData[]) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	return isLoading ? (
		<Loader />
	) : (
		<div className="table">
			<HeaderTable />
			{data?.map(({ records, _id, name }) => (
				<RowTable
					name={name}
					records={records}
					key={_id}
					id={_id}
					isOwner={true}
				/>
			))}
		</div>
	);
};
