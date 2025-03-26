import type { OwnerButtonsProps } from "./types";

export const OwnerButtons = ({
	setIsEdit,
	isEdit,
	onSave,
}: OwnerButtonsProps) => {
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
