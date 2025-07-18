import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import RoomCard from './RoomCard';
import RoomCardSkeleton from '../RoomCardSkeleton';

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

const RoomList: React.FC<{ filter: any }> = ({ filter }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // Reset khi filter thay đổi
  useEffect(() => {
    setRooms([]);
    setPage(1);
    setHasMore(true);
  }, [filter]);

  // Tải dữ liệu từng trang, loại bỏ phòng trùng roomId
  const fetchRooms = useCallback(
    async (pageNum: number) => {
      if (loading || !hasMore) return;
      setLoading(true);
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          `http://localhost:8080/api/rooms/search?provinceId=${filter.provinceId}&districtId=${filter.districtId}&wardId=${filter.wardId}&minPrice=${filter.minPrice}&maxPrice=${filter.maxPrice}&minArea=&maxArea=&page=${pageNum}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const newRooms = res.data.content || [];
        setRooms((prev) => {
          if (pageNum === 1) return newRooms;
          const existingIds = new Set(prev.map((r) => r.roomId));
          return [
            ...prev,
            ...newRooms.filter((r: Room) => !existingIds.has(r.roomId)),
          ];
        });
        setHasMore(newRooms.length > 0);
      } catch {
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore, filter],
  );

  // Tải dữ liệu khi page thay đổi
  useEffect(() => {
    fetchRooms(page);
  }, [page, fetchRooms]);

  // Infinite scroll
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore, loading]);

  return (
    <div className="max-w-2xl w-full mx-auto px-0">
      <div className="flex flex-col gap-4">
        {loading && rooms.length === 0
          ? Array.from({ length: 3 }).map((_, idx) => (
              <RoomCardSkeleton key={idx} />
            ))
          : rooms.map((room) => (
              <RoomCard
                key={room.roomId}
                room={room}
              />
            ))}
      </div>
      <div ref={loaderRef} />
      {loading && rooms.length > 0 && (
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
