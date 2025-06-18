// import { Apple, Twitter, CircleUserRound } from 'lucide-react';

import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="max-w-[390px] bg-gradient-to-t from-white to-[#f4f7fb] rounded-[40px] p-6 border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
        <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">
          Đăng Nhập
        </h2>
        <form className="mt-5 space-y-4">
          <input
            required
            type="email"
            name="email"
            placeholder="E-mail"
            className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Password"
            className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
          />
          <div className="text-left ml-2 text-xs text-[#0099ff]">
            <Link to="/forgot-password">Quên Mật Khẩu?</Link>
          </div>
          <input
            type="submit"
            value="Đăng Nhập"
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
          />
        </form>
        <div className="text-center mt-4 text-xs text-[#0099ff]">
          <span>Chưa có tài khoản? </span>
          <Link to="/signup" className="underline">
            Đăng Ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
