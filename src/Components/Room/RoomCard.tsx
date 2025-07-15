import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, MapPin, Home, Ruler, Users, Phone, Heart } from 'lucide-react';
import {
  renderGallery,
  renderSlideshow,
  isVideo,
} from '../../utils/RoomMediaUtils';

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
  const [images, setImages] = useState<{ mediaUrl: string }[]>([]);
  const [utilities, setUtilities] = useState<string[]>([]);
  const [owner, setOwner] = useState<{
    name: string;
    avatar?: string;
    phone?: string;
  } | null>(null);
  const [directionUrl, setDirectionUrl] = useState<string | null>(null);
  const [showSlideshow, setShowSlideshow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOwnerModal, setShowOwnerModal] = useState(false);

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
      .then((res) => {
        const mediaList = res.data;
        const videoItem = mediaList.find((item: any) => isVideo(item.mediaUrl));
        const imageItems = mediaList.filter(
          (item: any) => !isVideo(item.mediaUrl),
        );
        setImages(videoItem ? [videoItem, ...imageItems] : imageItems);
      })
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
        .get(`http://localhost:8080/api/managers/getById/${room.managerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) =>
          setOwner({
            name: res.data.userName,
            avatar: res.data.avatar,
            phone: res.data.phone,
          }),
        )
        .catch(() => setOwner(null));
    }

    axios
      .get(
        `http://localhost:8080/api/rooms/getDiractionUrl?roomId=${room.roomId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => setDirectionUrl(res.data))
      .catch(() => setDirectionUrl(null));
  }, [room]);

  return (
    <div className="bg-white rounded-xl shadow-md mb-8 max-w-2xl mx-auto border border-gray-100 flex flex-col">
      {/* Header: Avatar + Tên + Ngày + Tiêu đề */}
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
      {/* Tiêu đề bài viết */}
      <div className="px-6 pb-2">
        <h2 className="font-extrabold text-2xl text-gray-900 tracking-tight">
          {room.title}
        </h2>
      </div>
      {/* Gallery ảnh */}
      <div className="px-6">
        {renderGallery(images, setShowSlideshow, setCurrentIndex)}
      </div>
      {/* Nội dung */}
      <div className="px-6 pb-4 font-sans">
        <div className="my-3 px-4 py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-600 flex-shrink-0" />
          {directionUrl ? (
            <a
              href={directionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-base text-black font-medium hover:text-blue-700"
            >
              {address
                ? `${address.streetAddress}, ${address.wardAddress}, ${address.districtAddress}, ${address.provinceAddress}`
                : 'Đang tải địa chỉ...'}
            </a>
          ) : (
            <span className="underline text-base text-black font-medium">
              {address
                ? `${address.streetAddress}, ${address.wardAddress}, ${address.districtAddress}, ${address.provinceAddress}`
                : 'Đang tải địa chỉ...'}
            </span>
          )}
        </div>
        <div className="mb-2 flex items-center">
          <Home className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-base">Nội thất:</span>
          <span className="ml-2 text-gray-700 text-base">
            {utilities.length > 0 ? utilities.join(', ') : 'Chưa cập nhật'}
          </span>
        </div>
        <div className="mb-2 flex items-center">
          <Ruler className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-gray-700 text-base">Diện tích:</span>
          <span className="ml-1 font-semibold text-gray-900 text-base">
            {room.area} m²
          </span>
        </div>
        <div className="mb-2 flex items-center">
          <Home className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-gray-700 text-base">Giá:</span>
          <span className="ml-1 font-bold text-red-600 text-lg">
            {room.price.toFixed()} Triệu/tháng
          </span>
        </div>
        <div className="mb-2 flex items-center">
          <Users className="w-4 h-4 mr-1 text-blue-500" />
          <span className="text-gray-700 text-base">Ở tối đa:</span>
          <span className="ml-1 font-semibold text-gray-900 text-base">
            {room.maxOccupants} người
          </span>
        </div>
        {/* Thêm mô tả phòng ở cuối */}
        <div className="mt-2 text-gray-800 text-base">
          <span className="font-semibold">Mô tả phòng: </span>
          {room.description || 'Chưa có mô tả.'}
        </div>
      </div>
      {/* Thanh action */}
      <div className="flex border-t px-6 py-3 text-gray-600 text-base justify-center gap-32">
        <button className="flex items-center gap-2 hover:text-red-600 transition">
          <Heart className="w-5 h-5" /> Lưu
        </button>
        <button
          className="flex items-center gap-2 hover:text-blue-600 transition"
          onClick={() => setShowOwnerModal(true)}
        >
          <Phone className="w-5 h-5" /> Gọi số chủ
        </button>
      </div>
      {/* Slideshow modal */}
      {showSlideshow &&
        renderSlideshow(
          images,
          currentIndex,
          setCurrentIndex,
          setShowSlideshow,
        )}
      {/* Owner modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg min-w-[320px] relative">
            <button
              className="absolute top-3 right-3 text-xl"
              onClick={() => setShowOwnerModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-blue-700 mb-3">Thông tin</h2>
            <div className="font-semibold mb-2">Liên hệ xem phòng</div>
            <div className="mb-2">
              {owner?.name} - {owner?.phone || 'Chưa có số'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
