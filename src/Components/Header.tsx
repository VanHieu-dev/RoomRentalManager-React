import { UserCircle } from 'lucide-react'; // hoặc dùng react-icons/fa nếu thích

const Header = () => {
  const username = localStorage.getItem('username') || 'Tài khoản';
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-white shadow-sm mb-6">
      <div className="text-2xl font-bold text-blue-700">
        Room Rental Manager
      </div>
      <div className="flex items-center gap-2">
        <UserCircle className="w-8 h-8 text-blue-500" />
        <span className="font-semibold text-gray-700">{username}</span>
      </div>
    </header>
  );
};

export default Header;
