import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import FallbackImg from "../../assets/9dca345c5519d191af167abedf3b76ac.jpg";
import { Button } from "../Button";
import { ImageWithFallback } from "../Image";

interface NavProps {
	name?: string;
	img?: string;
}

export const Nav: React.FC<NavProps> = ({ name, img }) => {
	const { push } = useRouter();

	console.log(name);
	return (
		<div className="nav">
			<div className="nav__wrapper container">
				<Button label="Tabela" onClick={() => push("/")} />
				{name === "" || name === undefined ? (
					<div className="nav__guest-wrapper">
						<Button label="Login" onClick={() => push("/api/auth/signin")} />
						<Button label="Rejestracja" onClick={() => push("/register")} />
					</div>
				) : (
					<>
						<div className="nav__user-box">
							<ImageWithFallback
								src={img}
								fallbackSrc={FallbackImg.src}
								width={40}
								height={40}
								alt="avatar"
							/>
							<p className="nav__user-name">{name}</p>
						</div>
						<Button label="Logout" onClick={() => signOut()} />
					</>
				)}
			</div>
		</div>
	);
};
