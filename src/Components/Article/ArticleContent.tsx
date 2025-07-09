import React from 'react';
import { MapPin } from 'lucide-react';

interface ArticleContentProps {
  title: string;
  price: number;
  address: string;
  utilities: string[];
  area: number;
  mapUrl: string;
  maxOccupants: number; // Thêm prop cho maxOccupants
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  title,
  price,
  address,
  utilities,
  area,
  mapUrl,
  maxOccupants,
}) => {
  return (
    <div className="p-4 bg-white">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-black  mb-5 ">{title}</h1>

      {/* Địa chỉ lên đầu, không nhãn "Địa chỉ:" */}
      <p className="text-black mb-6 italic text-lg">🏠 {address}</p>

      {/* Nội dung xếp từ trên xuống */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Nội thất */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 mr-1">Nội thất:</span>
          <span className="text-black">
            {utilities.length > 0 ? utilities.join(', ') : 'Không có thông tin'}
          </span>
        </div>

        {/* Diện tích */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 mr-1">Diện tích:</span>
          <span className="text-black">{area} m²</span>
        </div>

        {/* Giá nhà */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 mr-1">Giá:</span>
          <span className="text-lg text-black">
            {(price / 1000000).toFixed(1)} Triệu/tháng
          </span>
        </div>

        {/* Số người tối đa (Ở tối đa) */}
        <div className="flex items-center">
          <span className="font-semibold text-gray-700 mr-1">Ở tối đa:</span>
          <span className="text-black">{maxOccupants} người</span>
        </div>
      </div>

      {/* Link địa chỉ với MapPin */}
      {mapUrl && (
        <div className="p-5 bg-gray-100 rounded flex items-center space-x-1">
          <MapPin className="w-5 h-5 text-red-500" />
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            {address}
          </a>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;