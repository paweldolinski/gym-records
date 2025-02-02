import type { AdminButtonsProps } from "./types";

export const AdminButtons = ({
	onDelete,
	onApprove,
	setIsEdit,
	isEdit,
	onSave,
}: AdminButtonsProps) => {
	return (
		<div className="table__btns-wrapper">
			<button type="button" className="table__btn" onClick={() => onApprove()}>
				Zatwierdz
			</button>
			<button type="button" className="table__btn" onClick={() => onDelete()}>
				Usuń
			</button>
			<button
				onClick={() => setIsEdit(!isEdit)}
				type="button"
				className="table__btn"
			>
				{isEdit ? "Zamknij" : "Edytuj"}
			</button>
			{isEdit ? (
				<button onClick={() => onSave()} type="button" className="table__btn">
					Zapisz
				</button>
			) : null}
		</div>
	);
};
