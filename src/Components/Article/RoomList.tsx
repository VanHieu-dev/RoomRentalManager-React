import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RoomCard from './RoomCard';

interface Room {
  roomId: number;
  title: string;
  price: number;
  area: number;
  maxOccupants: number;
  createdAt: string;
  addressId: number;
  description: string;
  managerId?: number;
}

const RoomList: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(
        'http://localhost:8080/api/rooms/search?provinceId=&districtId=&wardId=&minPrice=&maxPrice=&minArea=&maxArea=&page=1',
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => setRooms(res.data.content))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-8 px-2">
      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        Danh sách phòng trọ
      </h1>
      {loading ? (
        <div className="text-center text-gray-500 py-10">Đang tải...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {rooms.map((room) => (
            <RoomCard
              key={room.roomId}
              room={room}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
