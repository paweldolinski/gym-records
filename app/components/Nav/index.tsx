import { signOut } from "next-auth/react";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface NavProps {
	name: string;
	img?: string;
}

export const Nav: React.FC<NavProps> = ({ name, img }) => {
	const { push } = useRouter();

	return (
		<div className="nav">
			{name === "" ? (
				<Button label="Login" onClick={() => push("/api/auth/signin")} />
			) : (
				<>
					<div className="nav__user-box">
						<img className="nav__avatar" src={img} alt="avatar" />
						<p className="nav__user-name">{name}</p>
					</div>
					<Button label="Logout" onClick={() => signOut()} />
				</>
			)}
		</div>
	);
};
