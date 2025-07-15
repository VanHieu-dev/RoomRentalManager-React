import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Hàm tải dữ liệu từng trang
  const fetchRooms = useCallback(
    async (pageNum: number) => {
      if (loading || !hasMore) return;
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        console.log(
          `http://localhost:8080/api/rooms/search?provinceId=&districtId=&wardId=&minPrice=&maxPrice=&minArea=&maxArea=&page=${pageNum}`,
        );

        const res = await axios.get(
          `http://localhost:8080/api/rooms/search?provinceId=&districtId=&wardId=&minPrice=&maxPrice=&minArea=&maxArea=&page=${pageNum}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const newRooms = res.data.content || [];
        setRooms((prev) => (pageNum === 1 ? newRooms : [...prev, ...newRooms]));
        setHasMore(newRooms.length === 8); // Giả sử 8 là số lượng tối đa mỗi trang
      } catch (error) {
        console.error('Error fetching rooms:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore],
  );

  // Tải trang đầu tiên
  useEffect(() => {
    fetchRooms(1);
  },[]);

  // Infinite scroll với Intersection Observer
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null, // Sử dụng viewport làm root
        rootMargin: '200px', // Tải dữ liệu khi loaderRef cách viewport 200px
        threshold: 0, // Kích hoạt ngay khi loaderRef xuất hiện
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  // Tải dữ liệu khi page thay đổi
  useEffect(() => {
    if (page === 1) return;
    fetchRooms(page);
  }, [page, fetchRooms]);

  return (
    <div className="max-w-2xl mx-auto px-2">
      <div className="flex flex-col gap-4">
        {rooms.map((room) => (
          <RoomCard
            key={room.roomId}
            room={room}
          />
        ))}
      </div>
      <div ref={loaderRef} />
      {loading && (
        <div className="text-center text-gray-500 py-6">Đang tải...</div>
      )}
      {!hasMore && !loading && (
        <div className="text-center text-gray-400 py-6">
          Không còn bài viết nào nữa.
        </div>
      )}
    </div>
  );
};

export default RoomList;
