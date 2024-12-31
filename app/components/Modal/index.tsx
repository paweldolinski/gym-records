import { v4 as uuid } from "uuid";
import { useState } from "react";

interface ModalProps {
	onClose: (event: React.MouseEvent<HTMLSpanElement>) => void;
	id: string;
}

interface FormData {
	[key: string]: string;
	id: string;
}

const exercises = [
	{
		exercise: "squat",
		classic: "squatClassic",
		gear: "squatGear",
		placeholder: "Przysiad",
	},
	{
		exercise: "press",
		classic: "pressClassic",
		gear: "pressGear",
		placeholder: "Wyciskanie",
	},
	{
		exercise: "lift",
		classic: "liftClassic",
		gear: "liftGear",
		placeholder: "Martwy",
	},
];

export const Modal = ({ onClose, id }: ModalProps) => {
	const [formData, setFormData] = useState<FormData>({
		squatClassic: "",
		squatGear: "",
		pressClassic: "",
		pressGear: "",
		liftClassic: "",
		liftGear: "",
		id: id,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formData);
		try {
			await fetch("/api/users", {
				method: "POST",
				body: JSON.stringify(formData),
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div className="modal">
			<div className="modal__wrapper">
				<span className="modal__close-btn" onClick={() => onClose(false)}>
					&#x2715;
				</span>
				<span>Klasyk</span>
				<span>Sprzęt</span>
				<form onSubmit={handleSubmit}>
					{exercises?.map(({ exercise, classic, gear, placeholder }, index) => {
						return (
							<div key={index}>
								<input
									placeholder={placeholder}
									name={classic}
									onChange={handleInputChange}
									value={formData[classic]}
								/>
								<input
									placeholder={placeholder}
									name={gear}
									onChange={handleInputChange}
									value={formData[gear]}
								/>
							</div>
						);
					})}
					<button type="submit">Zapisz</button>
				</form>
			</div>
		</div>
	);
};
