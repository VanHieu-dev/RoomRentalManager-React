import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginErrors {
  username?: string; // Thay email thành username
  password?: string;
  general?: string;
}

const Login = () => {
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate(); // Sử dụng useNavigate cho điều hướng

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors: LoginErrors = {};

    if (!form.username.value.trim()) {
      newErrors.username = 'Vui lòng nhập username';
    } // Loại bỏ kiểm tra email format vì không cần nữa

    if (!form.password.value.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (form.password.value.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Gọi API đăng nhập
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: form.username.value,
        password: form.password.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          // Nếu backend trả về 500, coi như sai tài khoản/mật khẩu
          if (response.status === 500) {
            throw new Error('Tài khoản hoặc mật khẩu không đúng');
          }
          throw new Error('Đăng nhập thất bại');
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem('token', data.token);
        const base64Url = data.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        localStorage.setItem('username', payload.sub || payload.username);
        const role = payload.roles[0] || 'ROLE_USER';
        if (role === 'ROLE_USER' || role === 'ROLE_ADMIN') {
          navigate('/Home');
        } else if (role === 'ROLE_MANAGER') {
          navigate('/dashboard');
        }
        setErrors({});
      })
      .catch((error) => {
        // Nếu là lỗi tài khoản/mật khẩu thì báo đúng thông báo
        if (error.message === 'Tài khoản hoặc mật khẩu không đúng') {
          setErrors({ general: 'Tài khoản hoặc mật khẩu không đúng' });
        } else {
          setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại sau' });
        }
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="min-w-[390px] bg-gradient-to-t from-white to-[#f4f7fb] rounded-[40px] p-6 border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
        <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">
          Đăng Nhập
        </h2>
        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div>
            <input
              required
              type="text"
              name="username" // Thay name="email" thành name="username"
              placeholder="Username" // Thay placeholder "E-mail" thành "Username"
              className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
              onChange={handleChange}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) =>
                e.preventDefault()
              }
            />
            {errors.username && ( // Thay errors.email thành errors.username
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>
          <div>
            <input
              required
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400"
              onChange={handleChange}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) =>
                e.preventDefault()
              }
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div className="text-left ml-2 text-xs text-[#0099ff]">
            <Link to="/forgot-password">Quên Mật Khẩu?</Link>
          </div>
          <input
            type="submit"
            value="Đăng Nhập"
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
          />
          {errors.general && (
            <p className="text-red-500 text-center mt-2">{errors.general}</p>
          )}
        </form>
        <div className="text-center mt-4 text-xs text-[#0099ff]">
          <span>Chưa có tài khoản? </span>
          <Link
            to="/signup"
            className="underline"
          >
            Đăng Ký
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
