import { HTMLInputTypeAttribute } from "react";
import { UseFormRegister } from "react-hook-form";
import classNames from "classNames";

export default function InputFields(props: {
  name: string;
  label?: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: string;
  register: UseFormRegister<any>;
  value?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mb-6">
      {props.label && (
        <label
          htmlFor={props.name}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {props.label}
        </label>
      )}
      <input
        type={props.type}
        {...props.register(props.name)}
        value={props.value}
        className={classNames(
          "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
          {
            "bg-gray-100 border border-gray-300 cursor-not-allowed":
              props.disabled
          }
        )}
        placeholder={props.placeholder}
        required
        disabled={props.disabled}
      />
      {props.error && <span>This field is required</span>}
    </div>
  );
}
