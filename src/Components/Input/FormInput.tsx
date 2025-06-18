import type { ChangeEvent } from 'react';

interface FormInputProps {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const FormInput = ({
  name,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
}: FormInputProps) => {
  return (
    <input
      required={required}
      type={type}
      name={name}
      placeholder={placeholder}
      className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
      value={value}
      onChange={onChange}
      onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => e.preventDefault()}
    />
  );
};