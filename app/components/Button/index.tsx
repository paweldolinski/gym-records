interface ButtonProps {
	onClick: () => void;
	label: string;
}

export const Button: React.FC<ButtonProps> = ({ onClick, label }) => {
	return (
		<button type="button" onClick={onClick}>
			{label}
		</button>
	);
};
