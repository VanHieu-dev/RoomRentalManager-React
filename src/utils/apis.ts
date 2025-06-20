import type { FormData, FormErrors } from '../types/formTypes';
import { validateForm } from './formValidation';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  isLandlord: boolean,
  navigate: any,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  toast: any
) => {
  e.preventDefault();
  const form = e.currentTarget;

  const validationErrors: FormErrors = validateForm(form); // Cập nhật kiểu
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
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const msg = data.message || '';
      const newErrors: FormErrors = {};

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
    
    setErrors({});

    setTimeout(() => {
      navigate('/');
    }, 2000);
  } catch (err) {
    setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại sau' });
  }
};