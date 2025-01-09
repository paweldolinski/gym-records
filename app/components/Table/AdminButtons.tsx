interface ButtonsProps {
	onApprove: () => void;
	// onReject: () => void;
}

export const AdminButtons = ({ onApprove }: ButtonsProps) => {
	return (
		<div className="table__btns-wrapper">
			<button type="button" className="table__btn" onClick={() => onApprove()}>
				Zatwierdz
			</button>
			{/* <button type="button" className="table__btn" onClick={() => onReject()}>
				Odrzuć
			</button> */}
		</div>
	);
};
