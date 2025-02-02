interface InputProps {
	name: string;
	placeholder?: string;
	label?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({ name, placeholder, label, onChange }: InputProps) => {
	return (
		<div className="input__wrapper">
			{label ? <span className="input__label">{label}</span> : null}

			<input
				className="input__input"
				placeholder={placeholder}
				name={name}
				onChange={onChange}
			/>
		</div>
	);
};
