import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface FormData {
  userName: string;
  password: string;
  email: string;
  phone: string;
  role: string;
  addressId: null;
  address?: string;
  cmnd?: string;
  extraContact?: string;
  createdAt?: string;
}

const inputClass =
  'w-full bg-white border-none p-4 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400';
const passwordInputClass =
  'w-full bg-white border-none p-4 pr-12 rounded-[20px] shadow-[0_10px_10px_-5px_#cff0ff] focus:outline-none focus:border-x-2 focus:border-cyan-500 placeholder:text-gray-400';

const Signup = () => {
  const [isLandlord, setIsLandlord] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    userName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    phone?: string;
    address?: string;
    cmnd?: string;
    extraContact?: string;
    general?: string;
  }>({});

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIsLandlord(e.target.checked);
  };

  const toggleShow = (field: 'password' | 'confirm') => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const renderPasswordInput = (
    name: string,
    placeholder: string,
    show: boolean,
    toggle: () => void,
  ) => (
    <div className="relative">
      <input
        required
        type={show ? 'text' : 'password'}
        name={name}
        placeholder={placeholder}
        className={passwordInputClass}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        tabIndex={-1}
      >
        {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );

  const validateForm = (form: HTMLFormElement): { [key: string]: string } => {
    const errors: { [key: string]: string } = {};
    const fields = {
      userName: 'Tên người dùng',
      email: 'Email',
      phone: 'Số điện thoại',
      password: 'Mật khẩu',
      confirmPassword: 'Xác nhận mật khẩu',
    };

    Object.entries(fields).forEach(([key, label]) => {
      if (!form[key]?.value?.trim()) {
        errors[key] = `Vui lòng nhập ${label.toLowerCase()}`;
      }
    });

    const email = form.email?.value;
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }

    const phone = form.phone?.value;
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = 'Số điện thoại phải có 10 chữ số';
    }

    const password = form.password?.value;
    if (password && password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (password !== form.confirmPassword?.value) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (isLandlord) {
      ['address', 'cmnd', 'extraContact'].forEach((field) => {
        if (!form[field]?.value?.trim()) {
          errors[field] = `Vui lòng nhập ${
            field === 'cmnd' ? 'CMND/CCCD' : field
          }`;
        }
      });
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData: FormData = {
      userName: form.userName.value,
      email: form.email.value,
      phone: form.phone.value,
      password: form.password.value,
      role: isLandlord ? 'ROLE_MANAGER' : 'ROLE_USER',
      addressId: null,
      ...(isLandlord && {
        address: form.address.value,
        cmnd: form.cmnd.value,
        extraContact: form.extraContact.value,
        createdAt: '',
      }),
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/${isLandlord ? 'managers' : 'users'}/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const msg = data.message || '';
        const newErrors: { [key: string]: string } = {};

        if (msg.includes('Username')) {
          newErrors.userName = 'Tên người dùng đã tồn tại';
        } else if (msg.includes('Email')) {
          newErrors.email = 'Email đã tồn tại';
        } else {
          newErrors.general = msg || 'Có lỗi xảy ra khi đăng ký';
        }

        setErrors((prev) => ({ ...prev, ...newErrors }));
        return;
      }

      toast.success('Đăng ký thành công!');
      form.reset();
      setIsLandlord(false);
      setErrors({});

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại sau' });
    }
  };

  return (
    <div className="flex justify-center items-center h-[95vh]">
      <div className="min-w-[390px] max-w-[390px] bg-gradient-to-t from-white to-[#f4f7fb] rounded-[40px] p-6 border-4 border-white shadow-[0_30px_30px_-20px_rgba(133,189,215,0.88)] m-5">
        <h2 className="text-center font-extrabold text-[30px] text-[#1089d3]">
          Đăng Ký
        </h2>
        {errors.general && (
          <p className="text-red-500 text-center">{errors.general}</p>
        )}
        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit}
          noValidate // Thêm thuộc tính này để tắt validation mặc định của HTML
        >
          <div>
            <input
              required
              name="userName"
              placeholder="User name"
              className={inputClass}
              onChange={handleChange}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                e.preventDefault(); // Ngăn chặn thông báo mặc định
              }}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          <div>
            <input
              required
              type="text" // Thay type="email" bằng type="text" để kiểm soát hoàn toàn bằng validateForm
              name="email"
              placeholder="E-mail"
              className={inputClass}
              onChange={handleChange}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                e.preventDefault(); // Ngăn chặn thông báo mặc định
              }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              required
              type="number"
              name="phone"
              placeholder="Phone"
              className={inputClass}
              onChange={handleChange}
              onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                e.preventDefault(); // Ngăn chặn thông báo mặc định
              }}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            {renderPasswordInput(
              'password',
              'Password',
              showPassword.password,
              () => toggleShow('password'),
            )}
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            {renderPasswordInput(
              'confirmPassword',
              'Confirm Password',
              showPassword.confirm,
              () => toggleShow('confirm'),
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {isLandlord && (
            <div className="space-y-4">
              <input
                required
                name="address"
                placeholder="Address"
                className={inputClass}
                onChange={handleChange}
                onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                  e.preventDefault(); // Ngăn chặn thông báo mặc định
                }}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
              <input
                required
                name="cmnd"
                placeholder="CMND"
                className={inputClass}
                onChange={handleChange}
                onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                  e.preventDefault(); // Ngăn chặn thông báo mặc định
                }}
              />
              {errors.cmnd && (
                <p className="text-red-500 text-sm mt-1">{errors.cmnd}</p>
              )}
              <input
                name="extraContact"
                placeholder="Extra Contact"
                className={inputClass}
                onChange={handleChange}
                onInvalid={(e: React.InvalidEvent<HTMLInputElement>) => {
                  e.preventDefault(); // Ngăn chặn thông báo mặc định
                }}
              />
              {errors.extraContact && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.extraContact}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2 mt-7">
            <input
              type="checkbox"
              id="landlord"
              checked={isLandlord}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-cyan-500 focus:ring-cyan-500 border-gray-300 rounded"
            />
            <label
              htmlFor="landlord"
              className="text-gray-700"
            >
              Người cho thuê
            </label>
          </div>

          <input
            type="submit"
            value="Đăng Ký"
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-4 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)]"
          />
        </form>
      </div>
    </div>
  );
};

export default Signup;