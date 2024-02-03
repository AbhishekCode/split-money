import { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";
import { TextField, TextFieldVariants } from "@mui/material";

export default function InputFields(props: {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  register: UseFormRegister<any>;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  variant?: TextFieldVariants;
  style?: React.CSSProperties;
}) {
  return (
    <TextField
      id={props.name}
      {...props.register(props.name)}
      label={props.label}
      placeholder={props.placeholder}
      type={props.type}
      required={props.required}
      error={!!props.error}
      disabled={props.disabled}
      variant={props.variant || "filled"}
      fullWidth
      style={props.style}
    />
  );
}
