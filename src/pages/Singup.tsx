import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormInput } from '../Components/Input/FormInput';
import { PasswordInput } from '../Components/Input/PasswordInput';
import { handleSubmit } from '../utils/apis';
import type { FormErrors } from '../types/formTypes';

const SignupTest = () => {
  const [isLandlord, setIsLandlord] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLandlord(e.target.checked);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
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
          onSubmit={(e) => handleSubmit(e, isLandlord, navigate, setErrors, toast)}
          noValidate
        >
          <div>
            <FormInput
              name="userName"
              placeholder="User name"
              onChange={handleChange}
            />
            {errors.userName && (
              <p className="text-red-500 text-sm mt-1">{errors.userName}</p>
            )}
          </div>

          <div>
            <FormInput
              name="email"
              placeholder="E-mail"
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <FormInput
              name="phone"
              placeholder="Phone"
              type="number"
              onChange={handleChange}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <PasswordInput
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <PasswordInput
              name="confirmPassword"
              placeholder="Confirm Password"
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {isLandlord && (
            <div className="space-y-4">
              <FormInput
                name="address"
                placeholder="Address"
                onChange={handleChange}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
              <FormInput
                name="cmnd"
                placeholder="CMND"
                onChange={handleChange}
              />
              {errors.cmnd && (
                <p className="text-red-500 text-sm mt-1">{errors.cmnd}</p>
              )}
              <FormInput
                name="extraContact"
                placeholder="Extra Contact"
                onChange={handleChange}
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
            <label htmlFor="landlord" className="text-gray-700">
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

export default SignupTest;