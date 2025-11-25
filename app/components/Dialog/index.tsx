"use client";
import { useState } from "react";

interface DialogProps {
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  onCancel: () => void;
}

export function ConfirmDialog({
  onConfirm,
  onCancel,
  title,
  description,
}: DialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } catch (e) {
      alert(`Nie udało się wykonać operacji: ${e}`);
    } finally {
      setLoading(false);
      onCancel();
    }
  };

  return (
    <div className="dialog">
      <div className="dialog__wrapper">
        <h1 className="">{title}</h1>
        <p className="">{description}</p>
        <div className="">
          <button
            type="button"
            className="dialog__btns-wrapper"
            onClick={onCancel}
          >
            Anuluj
          </button>
          <button
            type="button"
            className=""
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Usuwanie..." : "Usuń"}
          </button>
        </div>
      </div>
    </div>
  );
}
