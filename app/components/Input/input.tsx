import React from "react";

interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  type: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  errorMsg?: string;
  value?: string;
  checked?: boolean;
  error?: boolean;
  onBlur?: () => void;
  variant?: string;
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
  checked,
  error,
  onBlur,
  variant,
}: InputProps) => {
  const isCheckbox = type === "checkbox";

  return (
    <div className={`input ${variant}`}>
      {type === "checkbox" ? (
        <label>
          <input
            className={`input__input ${error ? "error-active" : ""}`}
            placeholder={placeholder}
            name={name}
            {...(isCheckbox ? { checked } : { value })}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            type={type}
            pattern={pattern}
            onInvalid={(e) => e.preventDefault()}
          />
          {label && label}
        </label>
      ) : (
        <>
          {label && <span className="input__label">{label}</span>}
          <input
            className={`input__input ${error ? "error-active" : ""}`}
            placeholder={placeholder}
            name={name}
            {...(isCheckbox ? { checked } : { value })}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            type={type}
            pattern={pattern}
            onInvalid={(e) => e.preventDefault()}
          />
        </>
      )}

      {error && <div className="input__error-msg">{errorMsg}</div>}
    </div>
  );
};
