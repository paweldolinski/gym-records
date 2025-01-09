interface ButtonsProps {
	setIsEdit: (value: boolean) => void;
	isEdit: boolean;
	onSave: () => void;
}

export const OwnerButtons = ({ setIsEdit, isEdit, onSave }: ButtonsProps) => {
	return (
		<div className="table__btns-wrapper">
			<button
				onClick={() => setIsEdit(!isEdit)}
				type="button"
				className="table__btn"
			>
				{isEdit ? "close" : "Edit"}
			</button>
			{isEdit ? (
				<button onClick={() => onSave()} type="button" className="table__btn">
					Save
				</button>
			) : null}
		</div>
	);
};
