import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="min-w-[390px] bg-gradient-to-t from-white to-[#f4f7fb] rounded-[40px] p-6 border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
        <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">
          Quên Mật Khẩu
        </h2>

        <form className="mt-5 space-y-4">
          <input
            required
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
          />
          <div className="relative">
            <input
              required
              type={showPassword.password ? 'text' : 'password'}
              name="password"
              placeholder="New Password"
              className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400 pr-12"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword.password ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="relative">
            <input
              required
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confim Password"
              className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400 pr-12"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword.confirm ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          <input
            type="submit"
            value="Đặt lại mật khẩu"
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
          />
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
