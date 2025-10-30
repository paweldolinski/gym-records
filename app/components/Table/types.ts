export interface Record {
	exercise: string;
	classic: string;
	gear: string;
	_id?: string;
}

export interface UsersData {
	email?: string;
	records: Record[];
	name: string;
	_id: string;
	approved: boolean;
	img: string;
	isOwner?: boolean;
	isEmailVerified?: boolean;
}

export interface OwnerButtonsProps {
	setIsEdit: (value: boolean) => void;
	isEdit: boolean;
	onSave: () => void;
}

export interface AdminButtonsProps extends OwnerButtonsProps {
	onApprove: () => void;
	onDelete: () => void;
	approved?: boolean;
}
