export const HeaderTable = () => {
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
				<div className="table__cell--half table__cell">klasyk</div>
				<div className="table__cell--half table__cell">sprzęt</div>
				<div className="table__cell--half table__cell">klasyk</div>
				<div className="table__cell--half table__cell">sprzęt</div>
				<div className="table__cell--half table__cell">klasyk</div>
				<div className="table__cell--half table__cell">sprzęt</div>
			</div>
		</div>
	);
};
