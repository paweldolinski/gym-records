const topHeaderNames = ["Zawodnik", "Przysiad", "Wyciskanie", "Martwy ciąg"];

const renderTopHeader = topHeaderNames.map((name, index) =>
	index === 0 ? (
		<div className="table__cell table__cell--header user" key={name}>
			{name}
		</div>
	) : (
		<div className="table__cell table__cell--header" key={name}>
			{name}
		</div>
	),
);

const headerData = [
	{ exercise: "squat", types: ["classic", "gear"] },
	{ exercise: "press", types: ["classic", "gear"] },
	{ exercise: "lift", types: ["classic", "gear"] },
];
interface HeaderTableProps {
	setSortingExerciseAndType: (
		event: React.MouseEvent<HTMLButtonElement>,
	) => void;
}

export const HeaderTable = ({
	setSortingExerciseAndType,
}: HeaderTableProps) => {
	return (
		<div className="table__header-wrapper">
			<div className="table__sub-header-wrapper table__sub-header-wrapper--top">
				{renderTopHeader}
			</div>
			<div className="table__sub-header-wrapper table__sub-header-wrapper--bottom">
				<div className="table__cell user" />

				{headerData
					? headerData.map((exercise) =>
							exercise.types?.map((type) => (
								// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
								<div
									key={`${exercise.exercise}-${type}`}
									className="table__cell--half table__cell"
									data-name={exercise.exercise}
									data-type={type}
									onClick={setSortingExerciseAndType}
								>
									{type === "classic" ? "K" : "S"}
								</div>
							)),
						)
					: null}
			</div>
		</div>
	);
};
