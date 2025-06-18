import type { FormErrors } from '../types/formTypes';

export const validateForm = (form: HTMLFormElement): FormErrors => {
  const errors: FormErrors = {};
  const fields = {
    userName: 'Tên người dùng',
    email: 'Email',
    phone: 'Số điện thoại',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
  };

  Object.entries(fields).forEach(([key, label]) => {
    if (!form[key]?.value?.trim()) {
      errors[key as keyof FormErrors] = `Vui lòng nhập ${label.toLowerCase()}`;
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

  const landlordCheckbox = form.querySelector('input#landlord') as HTMLInputElement | null;
  const isLandlord = landlordCheckbox?.checked || false;

  if (isLandlord) {
    ['address', 'cmnd', 'extraContact'].forEach((field) => {
      if (!form[field]?.value?.trim()) {
        errors[field as keyof FormErrors] = `Vui lòng nhập ${
          field === 'cmnd' ? 'CMND/CCCD' : field
        }`;
      }
    });
  }

  return errors;
};