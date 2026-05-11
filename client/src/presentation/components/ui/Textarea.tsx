import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, id, ...props }) => (
  <div>
    <label className="label" htmlFor={id}>{label}</label>
    <textarea id={id} className="textarea-field" {...props} />
    {error && <p className="error-msg">{error}</p>}
  </div>
);
