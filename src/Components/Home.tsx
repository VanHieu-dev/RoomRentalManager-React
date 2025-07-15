import React from 'react';
import Search from './Search/search';
import RoomList from './Room/RoomList';

const Home: React.FC = () => {
  return (
    <div className="flex justify-center px-8 py-10 bg-gray-50 min-h-screen">
      {/* Cột trái: Search */}
      <div className="w-[320px] flex-shrink-0 mr-6">
        <Search />
      </div>
      {/* Cột giữa: RoomList */}
      <div className="flex justify-center">
        <div>
          <RoomList />
        </div>
      </div>
      {/* Cột phải: Tiện ích/phím tắt */}
      <div className="w-[220px] flex-shrink-0 ml-6 flex flex-col gap-4">
        <button className="bg-white rounded-lg shadow px-4 py-3 font-semibold text-gray-700 hover:bg-blue-50 transition">
          Tìm quanh đây
        </button>
        <button className="bg-white rounded-lg shadow px-4 py-3 font-semibold text-gray-700 hover:bg-blue-50 transition">
          Xem bản đồ
        </button>
        <button className="bg-white rounded-lg shadow px-4 py-3 font-semibold text-gray-700 hover:bg-blue-50 transition">
          Biểu đồ giá
        </button>
      </div>
    </div>
  );
};

export default Home;
