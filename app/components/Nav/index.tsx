import { signOut } from "next-auth/react";
import { Button } from "../Button";
import { useRouter } from "next/navigation";

interface NavProps {
	name: string | undefined | null;
}

export const Nav: React.FC<NavProps> = ({ name }) => {
	const { push } = useRouter();

	return (
		<div className="nav">
			<div className="nav__user-box">{name}</div>
			{name === null ? (
				<Button label="Login" onClick={() => push("/api/auth/signin")} />
			) : (
				<>
					<Button label="Logout" onClick={() => signOut()} />
				</>
			)}
		</div>
	);
};
