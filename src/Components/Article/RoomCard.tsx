import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, MapPin, Home, Ruler, Users, Phone, Heart } from 'lucide-react';

interface RoomCardProps {
  room: {
    roomId: number;
    title: string;
    price: number;
    area: number;
    maxOccupants: number;
    createdAt: string;
    addressId: number;
    description: string;
    managerId?: number;
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [address, setAddress] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [utilities, setUtilities] = useState<string[]>([]);
  const [owner, setOwner] = useState<{ name: string; avatar?: string } | null>(
    null,
  );

  // Slideshow state
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`http://localhost:8080/api/addresses/getById/${room.addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAddress(res.data))
      .catch(() => setAddress(null));

    axios
      .get(`http://localhost:8080/api/room-media/getByRoomId/${room.roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setImages(res.data.map((item: any) => item.mediaUrl)))
      .catch(() => setImages([]));

    axios
      .get(
        `http://localhost:8080/api/room-furniture/getByRoomId/${room.roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => setUtilities(res.data.utility || []))
      .catch(() => setUtilities([]));

    if (room.managerId) {
      axios
        .get(`http://localhost:8080/api/users/${room.managerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setOwner({ name: res.data.userName, avatar: res.data.avatar }),
        )
        .catch(() => setOwner(null));
    }
  }, [room]);

  // Gallery style giống Facebook/nguon-tro
  const renderGallery = () => {
    if (images.length === 0) return null;
    return (
      <div className="w-full h-64 flex gap-2 mb-4">
        {/* Ảnh lớn bên trái */}
        <div
          className="flex-1 h-full rounded-lg overflow-hidden cursor-pointer"
          onClick={() => {
            setShowSlideshow(true);
            setCurrentIndex(0);
          }}
        >
          <img
            src={images[0]}
            alt="room"
            className="object-cover w-full h-full"
          />
        </div>
        {/* 2 ảnh nhỏ bên phải */}
        <div className="flex flex-col gap-2 w-1/2 max-w-[48%]">
          <div
            className="flex-1 rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              setShowSlideshow(true);
              setCurrentIndex(1);
            }}
          >
            {images[1] && (
              <img
                src={images[1]}
                alt="room"
                className="object-cover w-full h-full"
              />
            )}
          </div>
          <div
            className="flex-1 rounded-lg overflow-hidden relative cursor-pointer"
            onClick={() => {
              setShowSlideshow(true);
              setCurrentIndex(2);
            }}
          >
            {images[2] && (
              <>
                <img
                  src={images[2]}
                  alt="room"
                  className="object-cover w-full h-full"
                />
                {images.length > 3 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                    +{images.length - 2}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Slideshow modal
  const renderSlideshow = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={() => setShowSlideshow(false)}
    >
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((currentIndex - 1 + images.length) % images.length);
        }}
      >
        &#8592;
      </button>
      <img
        src={images[currentIndex]}
        alt="slideshow"
        className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
        onClick={(e) => {
          e.stopPropagation();
          setCurrentIndex((currentIndex + 1) % images.length);
        }}
      >
        &#8594;
      </button>
      <button
        className="absolute top-6 right-6 bg-white/80 rounded-full p-2"
        onClick={(e) => {
          e.stopPropagation();
          setShowSlideshow(false);
        }}
      >
        Đóng
      </button>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md mb-8 max-w-2xl mx-auto border border-gray-100 flex flex-col">
      {/* Header: Avatar + Tên + Ngày */}
      <div className="flex items-center gap-3 px-6 pt-6 pb-2">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {owner?.avatar ? (
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-7 h-7 text-blue-500" />
          )}
        </div>
        <div>
          <div className="font-semibold text-gray-900">
            {owner?.name || 'Chủ phòng'}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(room.createdAt).toLocaleDateString('vi-VN')}
          </div>
        </div>
      </div>

      {/* Gallery ảnh */}
      <div className="px-6">{renderGallery()}</div>

      {/* Nội dung */}
      <div className="px-6 pb-4">
        <h2 className="font-bold text-2xl text-gray-900 mb-2">{room.title}</h2>
        <div className="flex items-center text-gray-700 mb-2">
          <MapPin className="w-5 h-5 mr-1 text-blue-500" />
          <span className="italic font-medium">
            {address
              ? `${address.streetAddress}, ${address.wardAddress}`
              : 'Đang tải địa chỉ...'}
          </span>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Nội thất:</span>{' '}
          {utilities.length > 0 ? utilities.join(', ') : 'Chưa cập nhật'}
        </div>
        <div className="mb-2 flex items-center">
          <Ruler className="w-4 h-4 mr-1 text-blue-500" />
          Diện tích: <span className="ml-1 font-semibold">{room.area} m²</span>
        </div>
        <div className="mb-2 flex items-center">
          <Home className="w-4 h-4 mr-1 text-blue-500" />
          Giá:{' '}
          <span className="ml-1 font-semibold">
            {(room.price / 1000000).toFixed(1)} Triệu/tháng
          </span>
        </div>
        <div className="mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1 text-blue-500" />Ở tối đa:{' '}
          <span className="ml-1 font-semibold">{room.maxOccupants} người</span>
        </div>
      </div>

      {/* Thanh action */}
      <div className="flex border-t px-6 py-3 text-gray-600 text-base justify-between">
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <Heart className="w-5 h-5" /> Lưu
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600 transition">
          <Phone className="w-5 h-5" /> Gọi số chủ
        </button>
      </div>

      {/* Slideshow modal */}
      {showSlideshow && renderSlideshow()}
    </div>
  );
};

export default RoomCard;
