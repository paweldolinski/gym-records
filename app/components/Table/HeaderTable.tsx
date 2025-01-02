export const HeaderTable = ({ setSortingExercise }) => {
	return (
		<div className="table__header-wrapper">
			<div className="table__sub-header-wrapper table__sub-header-wrapper--top">
				<div className="table__cell table__cell--header user">Zawodnik</div>
				<div className="table__cell table__cell--header">Przysiad</div>
				<div className="table__cell table__cell--header">Wyciskanie</div>
				<div className="table__cell table__cell--header">Martwy ciąg</div>
			</div>
			<div className="table__sub-header-wrapper table__sub-header-wrapper--bottom">
				<div className="table__cell user" />
				<div
					className="table__cell--half table__cell"
					data-name="squad"
					data-type="classic"
					onClick={(e) => setSortingExercise(e)}
				>
					klasyk
				</div>
				<div
					className="table__cell--half table__cell"
					data-name="squad"
					data-type="gear"
					onClick={(e) => setSortingExercise(e)}
				>
					sprzęt
				</div>
				<div
					className="table__cell--half table__cell"
					data-name="press"
					data-type="classic"
					onClick={(e) => setSortingExercise(e)}
				>
					klasyk
				</div>
				<div
					className="table__cell--half table__cell"
					data-name="press"
					data-type="gear"
					onClick={(e) => setSortingExercise(e)}
				>
					sprzęt
				</div>
				<div
					className="table__cell--half table__cell"
					data-name="lift"
					data-type="classic"
					onClick={(e) => setSortingExercise(e)}
				>
					klasyk
				</div>
				<div
					className="table__cell--half table__cell"
					data-name="lift"
					data-type="gear"
					onClick={(e) => setSortingExercise(e)}
				>
					sprzęt
				</div>
			</div>
		</div>
	);
};
