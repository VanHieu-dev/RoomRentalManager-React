import { UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogOut';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Tài khoản';
  const avatar = localStorage.getItem('avatar');
  const token = localStorage.getItem('token');
  let isManager = false;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isManager = payload.roles && payload.roles[0] === 'ROLE_MANAGER';
    } catch (e) {
      isManager = false;
    }
  }

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm mb-6">
      <div className="text-2xl font-bold text-blue-700">
        Room Rental Manager
      </div>
      <div className="flex items-center gap-2 select-none">
        {avatar ? (
          <img
            src={avatar}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
            {username[0]}
          </div>
        )}
        <span className="font-semibold text-gray-700">{username}</span>
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
