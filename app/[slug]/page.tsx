"use client";

import { Button } from "@/components/Button";
import Card from "@/components/Card";
import { ImageWithFallback } from "@/components/Image";
import { Loader } from "@/components/Loader";
import { Nav } from "@/components/Nav";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FallbackImg from "../assets/9dca345c5519d191af167abedf3b76ac.jpg";
import EditIcon from "../assets/edit-icon-511x512-ir85i9io.png";

const toBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export default function Page() {
  const params = useParams();
  const slug = params.slug as string;

  const [isEdit, setIsEdit] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    records: [],
    img: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { status, update } = useSession();
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    exercise: string,
    type: "classic" | "gear",
  ) => {
    const { value } = e.target;

    setUser((prev) => ({
      ...prev,
      records: prev.records.map((item) =>
        item.exercise === exercise ? { ...item, [type]: value } : item,
      ),
    }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setUser((prev) => ({
      ...prev,
      name: value,
    }));
  };
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/users/${slug}`, { method: "GET" });
      const { name, email, records, img } = await res.json();

      setUser({
        name: name,
        email: email,
        records: records,
        img: `${img}?cb=${Date.now()}`,
      });
      console.log("fetching");

      setIsLoading(false);
    } catch (err) {
      console.error("Błąd fetchowania danych:", err);
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const file = e.target.files?.[0];

    if (!file) return;

    const base64 = await toBase64(file);

    try {
      await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ img: base64, id: slug, type: "imageUpdate" }),
      });
      update({ image: file });
      setIsLoading(false);
      fetchData();
    } catch (error) {
      alert(`Coś poszło nie tak ${error}`);
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const onSave = async () => {
    setIsEdit(false);
    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ id: slug, data: user, type: "profileUpdate" }),
      });

      const { updatedData } = await response.json();

      setUser(updatedData);
      setIsLoading(false);
    } catch (e) {
      alert(`Error from update the profile: ${e}`);
      setIsLoading(false);
    }
    setIsEdit(false);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    fetchData();
  }, [slug]);

  return (
    <div className="profile">
      <Nav name={user?.name} id={slug} />

      {isLoading ? (
        <Loader />
      ) : (
        <Card>
          <div className="profile__profile-wrapper">
            <ImageWithFallback
              src={user?.img}
              fallbackSrc={FallbackImg.src}
              width={40}
              height={40}
              alt="avatar"
              key={user?.img}
            />

            <div className="profile__name-wrapper">
              <p>{user?.email}</p>
              <input
                className="profile__input"
                placeholder="Imię"
                onChange={(e) => handleNameChange(e)}
                value={user?.name}
                disabled={!isEdit}
                name="name"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleUpload(e);
                }}
                ref={fileInputRef}
              />
              <button onClick={handleClick} type="button">
                Zmień zdjęcie
              </button>
            </div>
            {isEdit ? (
              <div className="profile__edit-btns-wrapper">
                <Button label="✔" onClick={() => onSave()} />
                <Button onClick={() => setIsEdit(!isEdit)} label="&#x2715;" />
              </div>
            ) : (
              <ImageWithFallback
                src={EditIcon.src}
                fallbackSrc={FallbackImg.src}
                width={40}
                height={40}
                alt="editor-icon"
                variant="profile__edit-btn"
                onAction={() => setIsEdit(!isEdit)}
              />
            )}
          </div>
          <div className="profile__exercise-type-wrapper">
            <span>Klasyk</span>
            <span>Sprzęt</span>
          </div>

          {user?.records?.map(({ exercise, classic, gear }) => (
            <div className="profile__exercise-wrapper" key={exercise}>
              <p className="profile__exercise">{exercise}</p>
              <input
                className="profile__input"
                onChange={(e) => handleInputChange(e, exercise, "classic")}
                value={classic ?? ""}
                disabled={!isEdit}
                name={exercise}
                data-type="classic"
                type="number"
              />
              <input
                className="profile__input"
                onChange={(e) => handleInputChange(e, exercise, "gear")}
                value={gear ?? ""}
                disabled={!isEdit}
                name={exercise}
                data-type="gear"
                type="number"
              />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
