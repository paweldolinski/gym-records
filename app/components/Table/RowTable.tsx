import { v4 as uuid } from "uuid";

interface RecordsProps {
	exercise: string;
	classic: string;
	gear: string;
}

interface RowTableProps {
	email: string;
	records: RecordsProps[];
}

export const RowTable = ({ email, records }: RowTableProps) => {
	return (
		<div className="table__row-wrapper">
			<div className="table__cell" data-type="user">
				{email}
			</div>
			{records?.map((record, index) => {
				return (
					<div
						className="table__cell"
						data-exercise={record.exercise}
						key={uuid()}
					>
						<div className="table__cell--half table__cell" data-type="classic">
							{record.classic}
						</div>
						<div className="table__cell--half table__cell" data-type="gear">
							{record.gear}
						</div>
					</div>
				);
			})}
		</div>
	);
};
