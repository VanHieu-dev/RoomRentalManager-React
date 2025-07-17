import React, { useState } from "react";
import RoomList from "../Components/Room/RoomList";
import "./Dashboard2.css";
import Header from "../Components/Header";
import UserIntro from "../Components/Manager/UserIntro";
import PostItem from "../Components/Manager/PostItem";
import Lightbox from "../Components/Manager/Lightbox";
import CreatePostPopup from "../Components/Manager/CreatePostPopup";

interface Post {
  title: string;
  price: number;
  area: number;
  maxOccupants: number;
  streetAddress: string;
  description: string;
  wardName: string;
  districtName: string;
  provinceName: string;
  roomId: string;
  images: string[];
  utility: string[];
  author: string;
  timestamp: string;
}

interface LightboxState {
  isOpen: boolean;
  images: string[];
  initialIndex: number;
}

interface PostSubmitData {
  formData: {
    title: string;
    price: number;
    area: number;
    maxOccupants: number;
    streetAddress: string;
    description: string;
    wardName: string;
    districtName: string;
    provinceName: string;
  };
  uploadedMediaIds: string[];
  roomId: string;
  utility?: string[];
  furniture?: string[];
}

function Dashboard2(): TSX.Element {
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<string>("about");
  const [lightbox, setLightbox] = useState<LightboxState>({
    isOpen: false,
    images: [],
    initialIndex: 0,
  });

  const handleAddPostClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handlePostSubmit = (postData: PostSubmitData) => {
    const {
      formData,
      uploadedMediaIds: uploadedMediaUrls,
      roomId,
      utility,
      furniture,
    } = postData;

    const newPost: Post = {
      title: formData.title,
      price: formData.price,
      area: formData.area,
      maxOccupants: formData.maxOccupants,
      streetAddress: formData.streetAddress,
      description: formData.description,
      wardName: formData.wardName,
      districtName: formData.districtName,
      provinceName: formData.provinceName,
      roomId: roomId,
      images: uploadedMediaUrls,
      utility: utility || furniture || [],
      author: "Người dùng hiện tại",
      timestamp: new Date().toLocaleString("vi-VN"),
    };

    setPosts([newPost, ...posts]);
    setIsPopupOpen(false);
  };

  const handleImageClick = (images: string[], initialIndex: number) => {
    setLightbox({ isOpen: true, images, initialIndex });
  };

  const handleCloseLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <Header
        onAddPost={handleAddPostClick}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
      {isPopupOpen && (
        <CreatePostPopup  
          onClose={handleClosePopup}
          onPostSubmit={handlePostSubmit}
        />
      )}

      <div className="main-content">
        <div className="left-sidebar">
          <UserIntro />
        </div>
        <div className="posts-feed">
          {posts.map((post, index) => (
            <PostItem key={index} post={post} onImageClick={handleImageClick} />
          ))}
          <RoomList filter={null} />
        </div>
      </div>

      {lightbox.isOpen && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.initialIndex}
          onClose={handleCloseLightbox}
        />
      )}
    </>
  );
}

export default Dashboard2;
