import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import FallbackImg from "../../assets/9dca345c5519d191af167abedf3b76ac.jpg";
import { Button } from "../Button";
import { ImageWithFallback } from "../Image";

interface NavProps {
  name?: string;
  img?: string;
  id?: string;
}

export const Nav: React.FC<NavProps> = ({ name, img, id }) => {
  const { push } = useRouter();
  const pathname = usePathname();

  return (
    <div className="nav">
      <div className="nav__wrapper container">
        {pathname === "/" ? null : (
          <Button label="Tabela" onClick={() => push("/")} />
        )}

        {name === "" || name === undefined ? (
          <div className="nav__guest-wrapper">
            <Button label="Login" onClick={() => push("/api/auth/signin")} />
            <Button label="Rejestracja" onClick={() => push("/register")} />
          </div>
        ) : (
          <>
            {pathname === `/${id}` ? null : (
              <Link href={id}>
                <div className="nav__user-box">
                  <ImageWithFallback
                    src={img}
                    fallbackSrc={FallbackImg.src}
                    alt="avatar"
                  />
                  <p className="nav__user-name">{name}</p>
                </div>
              </Link>
            )}
            <Button label="Logout" onClick={() => signOut()} />
          </>
        )}
      </div>
    </div>
  );
};
