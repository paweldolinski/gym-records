import type { AdminButtonsProps } from "./types";
import { ConfirmDialog } from "@/components/Dialog";
import { useState } from "react";

export const AdminButtons = ({
	onDelete,
	onApprove,
	setIsEdit,
	isEdit,
	onSave,
	approved,
}: AdminButtonsProps) => {
	const [isOnDeleteOpen, setIsOnDeleteOpen] = useState(false);

	return (
		<div className="table__btns-wrapper">
			{!approved ? (
				<button
					type="button"
					className="table__btn"
					onClick={() => onApprove()}
				>
					Zatwierdz
				</button>
			) : null}

			<button
				type="button"
				className="table__btn"
				onClick={() => setIsOnDeleteOpen(true)}
			>
				Usuń
			</button>
			{isOnDeleteOpen ? (
				<ConfirmDialog
					onConfirm={() => onDelete()}
					onCancel={() => setIsOnDeleteOpen(false)}
					title="Na pewno?"
					description="Tej operacji nie można cofnąć."
				/>
			) : null}

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
