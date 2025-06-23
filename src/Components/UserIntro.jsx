// components/UserIntro.jsx
import React from "react";
import "./userIntro.css"; // Import CSS riêng nếu muốn

const UserIntro = () => {
  return (
    <div className="user-intro-container">
      <p className="section-title">Thông tin liên hệ</p>
      <div className="info-list">
        <InfoItem
          icon="fas fa-user"
          label="Họ và tên"
          highlight="Nguyễn Tá Đặng Minh"
        />
        <InfoItem
          icon="fas fa-phone"
          label="Số điện thoại"
          highlight="0123456678"
        />
        <InfoItem
          icon="fas fa-envelope"
          label="Email"
          highlight="nguyenTDminh@gmail.com"
        />
        <InfoItem
          icon="fab fa-facebook-messenger"
          label="Zalo"
          highlight="0123 456 789"
        />
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, highlight }) => (
  <div className="info-item">
    <i className={icon}></i>
    <p>
      {label}: <span className="highlight">{highlight}</span>
    </p>
  </div>
);

export default UserIntro;
