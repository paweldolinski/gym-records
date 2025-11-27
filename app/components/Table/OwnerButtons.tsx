import type { OwnerButtonsProps } from "./types";

export const OwnerButtons = ({
  setIsEdit,
  isEdit,
  onSave,
}: OwnerButtonsProps) => {
  return (
    <div className="table__btns-wrapper">
      <button
        onClick={() => setIsEdit(!isEdit)}
        type="button"
        className="table__btn"
      >
        {isEdit ? "Zamknij" : "Edytuj"}
      </button>
      {isEdit ? (
        <button onClick={() => onSave()} type="button" className="table__btn">
          Zapisz
        </button>
      ) : null}
    </div>
  );
};
