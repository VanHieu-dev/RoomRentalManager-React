import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatar');
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className="font-bold bg-gradient-to-r from-[#1089d3] to-[#12b1d1] text-white py-2 px-4 rounded-[20px] shadow-[0_20px_10px_-15px_rgba(133,189,215,0.88)] transition transform hover:scale-105 hover:shadow-[0_23px_10px_-20px_rgba(133,189,215,0.88)] active:scale-95 active:shadow-[0_15px_10px_-10px_rgba(133,189,215,0.88)] ml-4"
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
