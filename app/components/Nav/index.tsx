import { signOut } from "next-auth/react";
import { Button } from "../Button";
import { useRouter } from "next/navigation";
import FallbackImg from "../../assets/9dca345c5519d191af167abedf3b76ac.jpg";
import { ImageWithFallback } from "../Image";

interface NavProps {
	name: string;
	img?: string;
}

export const Nav: React.FC<NavProps> = ({ name, img }) => {
	const { push } = useRouter();

	return (
		<div className="nav">
			<div className="nav__wrapper container">
				{name === "" ? (
					<Button label="Login" onClick={() => push("/api/auth/signin")} />
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
