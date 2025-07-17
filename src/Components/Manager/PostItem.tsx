// This file has been renamed to PostItem.tsx
import React from "react";
import "./PostItem.css";

const amenityTranslations = {
  kitchen: "Bếp",
  bed: "Giường",
  wardrobe: "Tủ quần áo",
  airconditioner: "Điều hòa",
  fridge: "Tủ lạnh",
  wifi: "Wifi",
  balcony: "Ban công",
  "private bathroom": "Vệ sinh khép kín",
};

const PostItem = ({ post, onImageClick }) => {
  const displayedImages = post.images ? post.images.slice(0, 3) : [];
  const remainingImagesCount = post.images
    ? post.images.length - displayedImages.length
    : 0;

  return (
    <div className="post-item">
      <div className="post-header">
        <img
          src={
            "https://images.pexels.com/photos/32113427/pexels-photo-32113427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          }
          alt="avatar"
          className="user-avatar"
        />
        <span className="user-name">Minh Bon </span>
      </div>
      {post.title && <h3>{post.title}</h3>}
      {post.price && <p>Giá: {post.price} VNĐ</p>}
      {post.area && <p>Diện tích: {post.area} m²</p>}
      {post.maxOccupants && <p>Số người tối đa: {post.maxOccupants}</p>}
      {post.streetAddress && (
        <p>
          Địa chỉ: {post.streetAddress}, {post.wardName}, {post.districtName},{" "}
          {post.provinceName}
        </p>
      )}
      {post.description && <p className="post-text">{post.description}</p>}

      {post.utility && post.utility.length > 0 && (
        <div className="post-utility">
          <strong>Tiện ích:</strong>{" "}
          {post.utility.map((item, idx) => (
            <span key={idx} className="utility-item">
              {amenityTranslations[item.toLowerCase()] || item}
              {idx < post.utility.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>
      )}

      {displayedImages.length > 0 && (
        <div className={`post-images-grid grid-${displayedImages.length}`}>
          {displayedImages.map((mediaUrl, index) => (
            <div
              key={index}
              className="post-image-wrapper"
              onClick={(e) => {
                e.preventDefault();
                onImageClick(post.images, index);
              }}
            >
              {mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? (
                <video src={mediaUrl} controls className="post-image" />
              ) : (
                <img
                  src={mediaUrl}
                  alt={`Post media ${index}`}
                  className="post-image"
                />
              )}
              {index === 2 && remainingImagesCount > 0 && (
                <div className="image-overlay">+{remainingImagesCount}</div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Các nút actions - có thể thêm sau */}
      {/* <div className="post-actions"></div> */}
    </div>
  );
};

export default PostItem;
