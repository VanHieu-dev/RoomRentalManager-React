import React from "react";
import "./Header.css";

const ProfileHeader = ({ onAddPost }) => {
  return (
    <div className="profile-header">
      <div className="profile-header__container">
        {/* Cover Photo */}
        <div
          className="profile-header__cover"
          style={{
            backgroundImage: `url('https://media.vietnamplus.vn/images/4359a3df9b251435296fbde0195654bae870e8e185f555dd59f8a47dae44bb1ff51111f07d381c67c0c17271f60ee26a/Sea.jpg')`,
          }}
        ></div>

        {/* Avatar & Info */}
        <div className="profile-header__info">
          <div className="profile-header__avatar">
            <img
              src="https://images.pexels.com/photos/32113427/pexels-photo-32113427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Avatar"
              className="avatar-img"
            />
          </div>
          <div className="profile-header__details">
            <p className="profile-header__name">Minh Bon</p>
            <div className="profile-header__actions">
              <div className="profile-header__buttons">
                <button className="btn primary" onClick={onAddPost}>
                  <i className="fas fa-plus mr-2"></i>Thêm bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
