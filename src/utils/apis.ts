import type { FormData, FormErrors } from '../types/formTypes';
import { validateForm } from './formValidation';

export const handleSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  isLandlord: boolean,
  navigate: any,
  setErrors: React.Dispatch<React.SetStateAction<FormErrors>>,
  toast: any,
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
      },
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

    // Sau khi đăng ký thành công:
    toast.success('Đăng ký thành công!');

    // Gọi lại API đăng nhập với username và password vừa đăng ký
    fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.userName,
        password: formData.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Đăng nhập tự động thất bại');
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
        if (role === 'ROLE_MANAGER') {
          navigate('/dashboard');
        } else {
          navigate('/Home');
        }
      })
      .catch(() => {
        // Nếu đăng nhập tự động thất bại, chuyển về trang đăng nhập
        navigate('/Login');
      });
    form.reset();

    setErrors({});

    // setTimeout(() => {
    //   navigate('/');
    // }, 2000);
  } catch (err) {
    setErrors({ general: 'Có lỗi xảy ra, vui lòng thử lại sau' });
  }
};
