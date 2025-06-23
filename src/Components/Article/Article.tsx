import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArticleHeader from './ArticleHeader';
import ArticleDetails from './ArticleDetails';
import ArticleImageGallery from './ArticleImageGallery';
import ArticleActionButtonsFooter from './ArticleActionButtonsFooter';
import { getToken } from '../../utils/auth';
import { MapPin } from 'lucide-react';

const Article: React.FC = () => {
  const [room, setRoom] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [utilities, setUtilities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const roomResponse = await axios.get(
          'http://localhost:8080/api/rooms/search?provinceId=&districtId=&wardId=&minPrice=&maxPrice=&minArea=&maxArea=&page=1',
          { headers },
        );
        const roomData = roomResponse.data.content[0]; // Lấy phòng đầu tiên
        setRoom(roomData);

        const utilitiesResponse = await axios.get(
          `http://localhost:8080/api/room-furniture/getByRoomId/${roomData.roomId}`,
          { headers },
        );
        setUtilities(utilitiesResponse.data.utility);
        
        
        const mediaResponse = await axios.get(
          `http://localhost:8080/api/room-media/getByRoomId/${roomData.roomId}`,
          { headers },
        );
        setImages(mediaResponse.data.map((item: any) => item.mediaUrl));
        console.log(images);
        
        const addressResponse = await axios.get(
          `http://localhost:8080/api/addresses/getById/${roomData.addressId}`,
          { headers },
        );
        setAddress(addressResponse.data);

        const mapResponse = await axios.get(
          `http://localhost:8080/api/rooms/getDiractionUrl?roomId=${roomData.roomId}`,
          { headers },
        );
        setMapUrl(mapResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const openSlideshow = (index: number) => {
    setCurrentIndex(index);
    setIsSlideshow(true);
  };

  const handleViewMore = () => setShowAllImages(true);

  if (!room || !address) return <div className="text-center">Loading...</div>;

  return (
    <div className="article max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <ArticleHeader
        title={room.title}
        price={room.price}
        address={address.streetAddress + ', ' + address.wardAddress}
        utilities={utilities}
        services={[]} // Chưa có API cung cấp
        facilities={[]} // Chưa có API cung cấp
      />
      <ArticleDetails
        area={room.area}
        utilities={utilities}
      />
      <ArticleImageGallery
        images={images}
        onImageClick={openSlideshow}
        showAllImages={showAllImages}
        onViewMore={handleViewMore}
      />
      {mapUrl && (
        <div className="mt-4 p-4 bg-gray-100 rounded flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-red-500" /> {/* Icon location */}
          <a
            href={mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {address.streetAddress + ', ' + address.wardAddress}
          </a>
        </div>
      )}
      <ArticleActionButtonsFooter
      />{' '}
      {/* Tạm thời hardcode, cần API nếu có */}
      {isSlideshow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsSlideshow(false)}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt="fullscreen"
              className="max-h-[80vh]"
            />
            <button
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(
                  (prev) => (prev - 1 + images.length) % images.length,
                );
              }}
            >
              Prev
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % images.length);
              }}
            >
              Next
            </button>
            <button
              className="absolute top-2 right-2 bg-white p-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsSlideshow(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Article;
