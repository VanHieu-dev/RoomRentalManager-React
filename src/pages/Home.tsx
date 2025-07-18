import React, { useState } from 'react';
import Search from '../Components/Search/search';
import RoomList from '../Components/Room/RoomList';
import Header from '../Components/Header';

const Home: React.FC = () => {
  const [filter, setFilter] = useState({
    provinceId: '',
    districtId: '',
    wardId: '',
    minPrice: '',
    maxPrice: '',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex justify-center px-8">
        {/* Cột trái: Search */}
        <div className="w-[320px] flex-shrink-0 mr-6 sticky top-8 self-start z-10">
          <Search setFilter={setFilter} />
        </div>
        {/* Cột giữa: RoomList */}
        <div className="flex justify-center">
          <div className="max-w-2xl w-full">
            <RoomList filter={filter} />
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
    </div>
  );
};

export default Home;
