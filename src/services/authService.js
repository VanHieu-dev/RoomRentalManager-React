import axios from "axios";

const API_URL = "http://localhost:8080";

// Biến toàn cục để lưu managerId
let globalManagerId = 3; // Set giá trị mặc định là 3

// Hàm gọi API login và lưu token
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    if (response.data.token) {
      // Lưu token vào sessionStorage
      sessionStorage.setItem("token", response.data.token);
      console.log("Token đã lưu:", response.data.token);

      // Set managerId nếu có trong response
      if (response.data.managerId) {
        setManagerId(response.data.managerId);
      }
    } else {
      console.log("Không có token trong response:", response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    throw error;
  }
};

// Hàm lấy token
export const getToken = () => {
  return sessionStorage.getItem("token");
};

// Hàm xóa token khi logout
export const logout = () => {
  sessionStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Hàm lưu token mới
export const setToken = (token) => {
  sessionStorage.setItem("token", token);
  console.log("Token mới đã được lưu:", token);
};

// Hàm lấy managerId
export const getManagerId = () => {
  return globalManagerId;
};

// Hàm set managerId
export const setManagerId = (id) => {
  globalManagerId = id;
  console.log("ManagerId mới đã được lưu:", id);
};
