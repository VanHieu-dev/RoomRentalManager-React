import React, { useState, useEffect, type ChangeEvent } from 'react';
import './DashBorad.css';
import { jwtDecode } from 'jwt-decode';
import '@fortawesome/fontawesome-free/css/all.min.css';


// Định nghĩa interface cho thông tin manager
interface ManagerInfo {
  userName: string;
  email: string;
  phone: string;
  address: string;
  managerId: number; // Sửa thành number
}

// Định nghĩa interface cho dữ liệu token giải mã
interface DecodedToken {
  sub: string;
}

// Định nghĩa interface cho dữ liệu trả về từ API
interface ManagerApiResponse {
  userName: string;
  email: string;
  phone: string;
  address: string;
  managerId: number; // Thêm managerId vào API response
}

// Định nghĩa interface cho room
interface Room {
  roomId: number;
  managerId: number;
  title: string;
  description: string;
  price: number;
  area: number;
  maxOccupants: number;
  createdAt: string;
  isActive: number;
  updatedAt: string;
  addressId: number;
  address?: Address;
  media?: Media[];
  furniture?: string[];
}

// Định nghĩa interface cho address
interface Address {
  addressId: number;
  streetAddress: string;
  wardAddress: string;
  wardId: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
}

// Định nghĩa interface cho media
interface Media {
  mediaId: number;
  roomId: number;
  mediaUrl: string;
  uploadedAt: string;
}

// Định nghĩa interface cho province, district, ward
interface Province {
  provinceId: number;
  provinceName: string;
}

interface District {
  districtId: number;
  provinceId: number;
  districtName: string;
}

interface Ward {
  wardId: number;
  districtId: number;
  wardName: string;
}

const DashBoard: React.FC = () => {
  const [showPostForm, setShowPostForm] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    maxOccupants: '',
    streetAddress: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [managerInfo, setManagerInfo] = useState<ManagerInfo>({
    userName: '',
    email: '',
    phone: '',
    address: '',
    managerId: 0 // Khởi tạo mặc định
  });
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchManagerInfo = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        const decoded: DecodedToken = jwtDecode(token);
        const managerName = decoded.sub;

        const response = await fetch(`http://localhost:8080/api/managers/getByName?managerName=${managerName}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch manager info');
        }
        const data: ManagerApiResponse = await response.json();

        setManagerInfo({
          userName: data.userName || 'Unknown',
          email: data.email || 'No email provided',
          phone: data.phone || 'No phone provided',
          address: data.address || 'No address provided',
          managerId: data.managerId || 0
        });
      } catch (error) {
        console.error('Error fetching manager info:', error);
      }
    };

    const fetchRooms = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }

        if (!managerInfo.managerId) {
          console.error('Manager ID not available');
          return;
        }

        const roomsResponse = await fetch(`http://localhost:8080/api/rooms/search/by-manager-id?id=${managerInfo.managerId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!roomsResponse.ok) {
          throw new Error('Failed to fetch rooms');
        }

        const roomsData: Room[] = await roomsResponse.json();

        const roomsWithDetails = await Promise.all(roomsData.map(async (room) => {
          try {
            const addressResponse = await fetch(`http://localhost:8080/api/addresses/getById/${room.addressId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const addressData: Address = await addressResponse.json();

            const mediaResponse = await fetch(`http://localhost:8080/api/room-media/getByRoomId/${room.roomId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const mediaData: Media[] = await mediaResponse.json();

            const furnitureResponse = await fetch(`http://localhost:8080/api/room-furniture/getByRoomId/${room.roomId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            const furnitureData = await furnitureResponse.json();

            return {
              ...room,
              address: addressData,
              media: mediaData,
              furniture: furnitureData.utility
            };
          } catch (error) {
            console.error(`Error fetching details for room ${room.roomId}:`, error);
            return room;
          }
        }));

        setRooms(roomsWithDetails);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    const fetchProvinces = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found in localStorage');
          return;
        }
        const response = await fetch('http://localhost:8080/api/provinces/getAll', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch provinces');
        const data: Province[] = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchManagerInfo();
    if (managerInfo.managerId) {
      fetchRooms();
    }
    fetchProvinces();
  }, [managerInfo.managerId]);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async (): Promise<void> => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token not found in localStorage');
            return;
          }
          const response = await fetch(`http://localhost:8080/api/districts/getByProvince/${selectedProvince}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch districts');
          const data: District[] = await response.json();
          setDistricts(data);
          setSelectedDistrict('');
          setWards([]);
          setSelectedWard('');
        } catch (error) {
          console.error('Error fetching districts:', error);
        }
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async (): Promise<void> => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Token not found in localStorage');
            return;
          }
          const response = await fetch(`http://localhost:8080/api/wards/getByDistrict/${selectedDistrict}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Failed to fetch wards');
          const data: Ward[] = await response.json();
          setWards(data);
          setSelectedWard('');
        } catch (error) {
          console.error('Error fetching wards:', error);
        }
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const toggleAmenity = (amenity: string): void => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(item => item !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handlePostFormToggle = (): void => {
    setShowPostForm(!showPostForm);
    if (!showPostForm) {
      setFormData({
        title: '',
        description: '',
        price: '',
        area: '',
        maxOccupants: '',
        streetAddress: ''
      });
      setFiles([]);
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setAmenities([]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token not found in localStorage');
        return;
      }

      if (!managerInfo.managerId) {
        console.error('Manager ID not available');
        return;
      }

      // Tạo phòng mới
      const roomData = {
        managerId: managerInfo.managerId,
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        maxOccupants: formData.maxOccupants ? parseInt(formData.maxOccupants) : 1,
        streetAddress: formData.streetAddress,
        wardId: parseInt(selectedWard)
      };

      const roomResponse = await fetch('http://localhost:8080/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(roomData)
      });

      if (!roomResponse.ok) throw new Error('Failed to create room');
      const roomResult = await roomResponse.json();
      const roomId = roomResult.roomId;

      // Tải lên media
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        formData.append('roomId', roomId.toString());

        const mediaResponse = await fetch(`http://localhost:8080/api/room-media/create?roomId=${roomId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (!mediaResponse.ok) throw new Error('Failed to upload media');
      }

      // Tạo furniture
      if (amenities.length > 0) {
        const furnitureData = {
          roomId: roomId,
          furnitureName: amenities
        };

        const furnitureResponse = await fetch('http://localhost:8080/api/room-furniture/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(furnitureData)
        });

        if (!furnitureResponse.ok) throw new Error('Failed to create furniture');
      }

      // Làm mới danh sách phòng
      const roomsResponse = await fetch(`http://localhost:8080/api/rooms/search/by-manager-id?id=${managerInfo.managerId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const roomsData: Room[] = await roomsResponse.json();
      const roomsWithDetails = await Promise.all(roomsData.map(async (room) => {
        try {
          const addressResponse = await fetch(`http://localhost:8080/api/addresses/getById/${room.addressId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const addressData: Address = await addressResponse.json();

          const mediaResponse = await fetch(`http://localhost:8080/api/room-media/getByRoomId/${room.roomId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const mediaData: Media[] = await mediaResponse.json();

          const furnitureResponse = await fetch(`http://localhost:8080/api/room-furniture/getByRoomId/${room.roomId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const furnitureData = await furnitureResponse.json();

          return {
            ...room,
            address: addressData,
            media: mediaData,
            furniture: furnitureData.utility
          };
        } catch (error) {
          console.error(`Error fetching details for room ${room.roomId}:`, error);
          return room;
        }
      }));
      setRooms(roomsWithDetails);

      // Reset form và đóng
      setShowPostForm(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        area: '',
        maxOccupants: '',
        streetAddress: ''
      });
      setFiles([]);
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
      setAmenities([]);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="DashBoard-container">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="user-info">
              <img 
                src="https://readdy.ai/api/search-image?query=professional%20portrait%20photo%20of%20a%20Vietnamese%20real%20estate%20manager%2C%20male%2C%2035%20years%20old%2C%20wearing%20business%20casual%20attire%2C%20friendly%20smile%2C%20high%20quality%20professional%20headshot%20with%20neutral%20background%2C%20photorealistic&width=80&height=80&seq=1&orientation=squarish" 
                alt="Avatar" 
                className="avatar"
              />
              <div>
                <h1 className="user-name">{managerInfo.userName}</h1>
                <p className="user-role">Chủ trọ</p>
              </div>
            </div>
            <button className="edit-button">
              <i className="fas fa-edit edit-icon"></i>Chỉnh sửa thông tin
            </button>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-icon-container">
                <i className="fas fa-envelope"></i>
              </div>
              <div>
                <p className="info-label">Email</p>
                <p className="info-value">{managerInfo.email}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-container">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div>
                <p className="info-label">Số điện thoại</p>
                <p className="info-value">{managerInfo.phone}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-container">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div>
                <p className="info-label">Địa chỉ quản lý trọ</p>
                <p className="info-value">{managerInfo.address}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon-container">
                <i className="fas fa-home"></i>
              </div>
              <div>
                <p className="info-label">Số lượng bài đăng</p>
                <p className="info-value">{rooms.length} bài đăng</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="post-header">
          <h2 className="section-title">Danh sách bài đăng</h2>
          <button 
            onClick={handlePostFormToggle}
            className="post-new-button"
          >
            <i className="fas fa-plus-circle button-icon"></i>Đăng tin mới
          </button>
        </div>

        {showPostForm && (
          <div className="post-form-container">
            <h3 className="form-title">Đăng tin mới</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="title">Tiêu đề</label>
                <input 
                  type="text" 
                  id="title"
                  className="form-input" 
                  placeholder="Nhập tiêu đề bài đăng"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hình ảnh</label>
                <div className="image-upload">
                  <i className="fas fa-cloud-upload-alt upload-icon"></i>
                  <p className="upload-text">Kéo thả ảnh vào đây hoặc</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="upload-button"
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="upload-button">
                    Chọn ảnh từ máy tính
                  </label>
                </div>
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label" htmlFor="province">Tỉnh/Thành phố</label>
                  <select 
                    id="province"
                    className="form-select"
                    value={selectedProvince}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedProvince(e.target.value)}
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map(province => (
                      <option key={province.provinceId} value={province.provinceId}>
                        {province.provinceName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="district">Quận/Huyện</label>
                  <select 
                    id="district"
                    className="form-select"
                    value={selectedDistrict}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDistrict(e.target.value)}
                    disabled={!selectedProvince}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(district => (
                      <option key={district.districtId} value={district.districtId}>
                        {district.districtName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" htmlFor="ward">Phường/Xã</label>
                  <select 
                    id="ward"
                    className="form-select"
                    value={selectedWard}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedWard(e.target.value)}
                    disabled={!selectedDistrict}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(ward => (
                      <option key={ward.wardId} value={ward.wardId}>
                        {ward.wardName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="streetAddress">Địa chỉ đường</label>
                <input 
                  type="text" 
                  id="streetAddress"
                  className="form-input" 
                  placeholder="VD: 569 đường Đông La"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-grid">
                <div>
                  <label className="form-label" htmlFor="price">Giá phòng (VNĐ/tháng)</label>
                  <input 
                    type="text" 
                    id="price"
                    className="form-input" 
                    placeholder="VD: 1200000"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="area">Diện tích (m²)</label>
                  <input 
                    type="text" 
                    id="area"
                    className="form-input" 
                    placeholder="VD: 30.5"
                    value={formData.area}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="form-label" htmlFor="maxOccupants">Số người ở tối đa</label>
                  <input 
                    type="number" 
                    id="maxOccupants"
                    className="form-input" 
                    placeholder="VD: 3"
                    value={formData.maxOccupants}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nội thất</label>
                <div className="amenities-grid">
                  {['Điều hòa', 'Máy giặt', 'Tủ lạnh', 'Bàn ghế', 'Giường', 'Tủ quần áo', 'Bếp', 'Nhà vệ sinh riêng'].map((item) => (
                    <div key={item} className="amenity-item">
                      <input 
                        type="checkbox" 
                        id={item} 
                        checked={amenities.includes(item)}
                        onChange={() => toggleAmenity(item)}
                        className="amenity-checkbox" 
                      />
                      <label htmlFor={item} className="amenity-label">{item}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Mô tả thêm</label>
                <textarea 
                  id="description"
                  className="form-textarea"
                  placeholder="Nhập mô tả chi tiết về phòng trọ..."
                  value={formData.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={handlePostFormToggle}
                  className="cancel-button"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                >
                  Đăng bài
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="post-grid">
          {rooms.map((room) => (
            <div key={room.roomId} className="post-item">
              <div className="post-image-container">
                <img 
                  src={room.media?.find(m => m.mediaUrl.endsWith('.png') || m.mediaUrl.endsWith('.jpg'))?.mediaUrl || 'https://via.placeholder.com/400x250'} 
                  alt={room.title} 
                  className="post-image"
                />
                <span className={`post-status ${room.isActive ? 'active' : 'inactive'}`}>
                  {room.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                </span>
              </div>
              <div className="post-content">
                <div className="post-header">
                  <h3 className="post-title">{room.title}</h3>
                  <div className="post-menu">
                    <button className="menu-button" aria-label="Mở menu tùy chọn" title="Mở menu tùy chọn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                    <div className="menu-dropdown">
                      <button className="menu-item">
                        <i className="fas fa-edit menu-icon"></i>Chỉnh sửa
                      </button>
                      <button className="menu-item">
                        <i className={`fas fa-${room.isActive ? 'eye-slash' : 'eye'} menu-icon`}></i>
                        {room.isActive ? 'Ẩn bài đăng' : 'Hiện bài đăng'}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="post-address">
                  <i className="fas fa-map-marker-alt address-icon"></i>
                  {room.address ? `${room.address.streetAddress}, ${room.address.wardAddress}` : 'Đang tải địa chỉ...'}
                </p>
                
                <div className="post-details">
                  <div className="detail-item">
                    <i className="fas fa-money-bill-wave detail-icon"></i>
                    <span className="detail-value">{room.price.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-expand detail-icon"></i>
                    <span>{room.area}m²</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-user detail-icon"></i>
                    <span>{room.maxOccupants} người</span>
                  </div>
                </div>
                
                <div className="post-amenities">
                  {room.furniture?.map((item) => (
                    <span key={item} className="amenity-tag">
                      <i className={`fas fa-${item === 'fridge' ? 'snowflake' : item === 'kitchen' ? 'utensils' : 'couch'} amenity-icon`}></i>
                      {item === 'fridge' ? 'Tủ lạnh' : item === 'kitchen' ? 'Bếp' : item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <nav className="pagination-nav">
            <button className="pagination-button" aria-label="Trang trước" title="Trang trước">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="pagination-button active">1</button>
            <button className="pagination-button">2</button>
            <button className="pagination-button">3</button>
            <button className="pagination-button" aria-label="Trang sau" title="Trang sau">
              <i className="fas fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </main>
    </div>
  );
};

export default DashBoard;