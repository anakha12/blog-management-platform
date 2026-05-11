import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => (
  <div>
    <label className="label" htmlFor={id}>{label}</label>
    <input id={id} className="input-field" {...props} />
    {error && <p className="error-msg">{error}</p>}
  </div>
);
