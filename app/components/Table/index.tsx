import { useEffect, useState } from "react";
import { HeaderTable } from "./HeaderTable";
import { RowTable } from "./RowTable";
import { Loader } from "../Loader";

interface UsersData {
	email: string;
	records: [];
	_id: string;
}

export const Table = () => {
	const [data, setData] = useState<UsersData[] | null>(null);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/users")
			.then((res) => res.json())
			.then((data: UsersData[]) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	console.log(data, "data");
	return isLoading ? (
		<Loader />
	) : (
		<div className="table">
			<HeaderTable />
			{data?.map(({ email, records, _id }) => (
				<RowTable email={email} records={records} key={_id} />
			))}
		</div>
	);
};
