import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput = ({ name, placeholder, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShow = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative">
      <input
        required
        type={showPassword ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        className="w-full bg-white border-none p-4 pr-12 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
        onChange={onChange}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
};