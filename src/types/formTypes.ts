export interface FormData {
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

export interface FormErrors {
  userName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  address?: string;
  cmnd?: string;
  extraContact?: string;
  general?: string;
}