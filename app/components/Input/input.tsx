import { useState } from "react";

interface InputProps {
	name: string;
	placeholder?: string;
	label?: string;
	required?: boolean;
	type: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	pattern?: string;
	errorMsg?: string;
	value: string;
}

export const Input = ({
	name,
	placeholder,
	label,
	onChange,
	required = false,
	type,
	pattern,
	errorMsg,
	value,
}: InputProps) => {
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		if (pattern) {
			const regex = new RegExp(pattern);

			if (!regex.test(e.target.value)) {
				setErrorMessage(errorMsg || "Nieprawidłowa wartość");
			} else {
				setErrorMessage(null);
			}
		}
	};

	return (
		<div className="input">
			{label && <span className="input__label">{label}</span>}

			<input
				className={`input__input ${errorMessage ? "error-active" : ""}`}
				placeholder={placeholder}
				name={name}
				value={value}
				onChange={onChange}
				onBlur={handleBlur}
				required={required}
				type={type}
				pattern={pattern}
				onInvalid={(e) => e.preventDefault()}
			/>
			{errorMessage && <div className="input__error-msg">{errorMessage}</div>}
		</div>
	);
};
