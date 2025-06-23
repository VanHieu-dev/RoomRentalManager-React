import React, { useState } from "react";
import Header from "./Components/Header";
import CreatePostPopup from "./Components/CreatePostPopup";
import PostItem from "./Components/PostItem";
import Lightbox from "./Components/Lightbox";
import UserIntro from "./Components/UserIntro";
import "./App.css";

function App() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("about"); // Mặc định hiển thị About
  const [lightbox, setLightbox] = useState({
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

  const handlePostSubmit = (postData) => {
    // postData từ CreatePostPopup chứa formData và uploadedMediaIds (trước đây là uploadedMediaIds)
    const {
      formData,
      uploadedMediaIds: uploadedMediaUrls,
      roomId,
      utility,
      furniture,
    } = postData;

    // Sử dụng trực tiếp các URL đã tải lên
    const imageUrls = uploadedMediaUrls;

    const newPost = {
      // Các thông tin từ formData
      title: formData.title,
      price: formData.price,
      area: formData.area,
      maxOccupants: formData.maxOccupants,
      streetAddress: formData.streetAddress,
      description: formData.description, // Đổi lại thành description
      wardName: formData.wardName,
      districtName: formData.districtName,
      provinceName: formData.provinceName,
      // Thêm roomId
      roomId: roomId,
      // URL ảnh
      images: imageUrls,
      // Thêm tiện ích (ưu tiên utility, fallback furniture)
      utility: utility || furniture || [],
      // Các trường khác có thể cần cho PostItem (ví dụ: author, timestamp)
      author: "Người dùng hiện tại", // Hoặc lấy từ authService nếu có
      timestamp: new Date().toLocaleString("vi-VN"),
    };

    setPosts([newPost, ...posts]);
    setIsPopupOpen(false);
  };

  const handleImageClick = (images, initialIndex) => {
    console.log("Image clicked!");
    console.log("Images data:", images);
    console.log("Initial index:", initialIndex);
    setLightbox({ isOpen: true, images, initialIndex });
  };

  const handleCloseLightbox = () => {
    setLightbox({ ...lightbox, isOpen: false });
  };

  const handleTabChange = (tab) => {
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

export default App;
