import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getManagerId } from "/src/services/authService";
import "./CreatePostPopup.css";

// Cấu hình axios mặc định
axios.defaults.baseURL = "http://localhost:8080"; // URL của backend
axios.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`; // Thêm token vào mọi request

const CreatePostPopup = ({ onClose, onPostSubmit }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null); // Thêm state quản lý roomId
  const [isUploadStep, setIsUploadStep] = useState(false); // Thêm state quản lý bước
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadedMediaIds, setUploadedMediaIds] = useState([]); // New state to store uploaded media IDs
  const [videos, setVideos] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);
  const [uploadedVideoIds, setUploadedVideoIds] = useState([]);
  const [furniture, setFurniture] = useState({
    airconditioner: false,
    fridge: false,
    kitchen: false,
    bed: false,
    wardrobe: false,
  });

  const [formData, setFormData] = useState({
    provinceId: "",
    provinceName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    title: "",
    price: "",
    area: "",
    maxOccupants: "",
    streetAddress: "",
    description: "",
  });

  // Gọi API lấy danh sách tỉnh thành
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) {
          throw new Error("Không tìm thấy token xác thực");
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axios.get("/api/provinces/getAll");
        console.log("API Response:", response.data);
        setProvinces(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
        setError(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi lấy danh sách tỉnh thành"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      const selectedProvince = provinces.find(
        (p) => p.provinceId.toString() === value
      );
      if (selectedProvince) {
        setFormData((prev) => {
          const newData = {
            ...prev,
            provinceId: selectedProvince.provinceId,
            provinceName: selectedProvince.provinceName,
            district: "",
            districtName: "",
            ward: "",
            wardName: "",
          };
          console.log("Form data sau khi cập nhật:", newData);
          return newData;
        });

        const fetchDistricts = async () => {
          try {
            const token = getToken();
            if (!token) {
              throw new Error("Không tìm thấy token xác thực cho districts");
            }
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const response = await axios.get(
              `/api/districts/getByProvince/${selectedProvince.provinceId}`
            );
            setDistricts(response.data);
            setWards([]);
          } catch (error) {
            console.error("Lỗi khi gọi API districts:", error);
          }
        };
        fetchDistricts();
      }
    } else if (name === "district") {
      const selectedDistrict = districts.find(
        (d) => d.districtId.toString() === value
      );
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtName: selectedDistrict ? selectedDistrict.districtName : "",
        ward: "",
        wardName: "",
      }));

      const fetchWards = async () => {
        try {
          const token = getToken();
          if (!token) {
            throw new Error("Không tìm thấy token xác thực cho wards");
          }
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const response = await axios.get(`/api/wards/getByDistrict/${value}`);
          console.log("API Response (wards):", response.data);
          setWards(response.data);
        } catch (error) {
          console.error("Lỗi khi gọi API wards:", error);
        }
      };
      if (value) {
        fetchWards();
      } else {
        setWards([]);
      }
    } else if (name === "ward") {
      const selectedWard = wards.find((w) => w.wardId.toString() === value);
      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: value,
          wardName: selectedWard ? selectedWard.wardName : "",
        };
        console.log("Form data sau khi cập nhật (chọn Phường/Xã):", newData);
        return newData;
      });
    } else if (name === "area") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length + videos.length > 1) {
      setError("Chỉ được upload tối đa 1 video");
      return;
    }

    const newVideos = [...videos];
    const newPreviewUrls = [...videoPreviewUrls];

    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        newVideos.push(file);
        const videoUrl = URL.createObjectURL(file);
        newPreviewUrls.push(videoUrl);
      } else {
        setError("Vui lòng chỉ upload file video");
      }
    });

    setVideos(newVideos);
    setVideoPreviewUrls(newPreviewUrls);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = [...videos];
    const newPreviewUrls = [...videoPreviewUrls];
    newVideos.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    setVideos(newVideos);
    setVideoPreviewUrls(newPreviewUrls);
  };

  const handleFurnitureChange = (e) => {
    const { name, checked } = e.target;
    setFurniture((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    let uploadedMediaUrls = [];
    // Kiểm tra các trường bắt buộc
    if (
      !formData.title ||
      !formData.price ||
      !formData.area ||
      !formData.maxOccupants ||
      !formData.streetAddress ||
      !formData.provinceId ||
      !formData.district ||
      !formData.ward
    ) {
      setError("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
      return;
    }
    setError(null);

    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("Không tìm thấy token xác thực");
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // 1. Tạo phòng trước
      const roomDataToSend = {
        managerId: getManagerId(),
        title: formData.title,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        maxOccupants: parseInt(formData.maxOccupants, 10),
        streetAddress: formData.streetAddress,
        description: formData.description,
        wardId: parseInt(formData.ward, 10),
      };
      const response = await axios.post("/api/rooms/create", roomDataToSend);
      const newRoomId = response.data.roomId;
      setCurrentRoomId(newRoomId);

      // 2. Gửi nội thất
      const selectedFurniture = Object.keys(furniture).filter(
        (key) => furniture[key]
      );
      if (selectedFurniture.length > 0) {
        await axios.post("/api/room-furniture/create", {
          roomId: newRoomId,
          furnitureName: selectedFurniture,
        });
      }

      // 3. Upload ảnh và video (dùng chung API room-media)
      if (images.length > 0 || videos.length > 0) {
        const formDataMedia = new FormData();
        images.forEach((file) => {
          formDataMedia.append("files", file);
        });
        videos.forEach((file) => {
          formDataMedia.append("files", file);
        });

        try {
          const response = await axios.post(
            `http://localhost:8080/api/room-media/create?roomId=${newRoomId}`,
            formDataMedia
          );
          console.log("Upload successful:", response.data);
          const uploadedMedia = response.data;
          uploadedMediaUrls = uploadedMedia.map((item) => item.mediaUrl);
        } catch (error) {
          console.error(
            "Error uploading media:",
            error.response?.data || error.message,
            error.code
          );
        }
      }

      // Gửi dữ liệu về component cha
      const dataToSubmit = {
        formData: formData,
        furniture: selectedFurniture,
        roomId: newRoomId,
        utility: selectedFurniture,
        uploadedMediaIds: uploadedMediaUrls,
      };
      onPostSubmit(dataToSubmit);
      onClose();
    } catch (error) {
      console.error("Lỗi khi tạo phòng trọ:", error);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo phòng trọ"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    if (files.length + images.length > 5) {
      setError("Chỉ được tải lên tối đa 5 ảnh");
      return;
    }

    setLoading(true);
    setError(null);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setImages((prev) => [...prev, ...files]);
    setLoading(false);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="create-post-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Đăng bài mới</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="popup-body">
          <div className="form-container">
            {/* Cột trái - Thông tin địa chỉ và phòng trọ */}
            <div className="left-column">
              <div className="form-section">
                <h3>Thông tin địa chỉ</h3>
                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <select
                    name="province"
                    value={formData.provinceId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    {provinces.map((province) => (
                      <option
                        key={province.provinceId}
                        value={province.provinceId}
                      >
                        {province.provinceName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.provinceId}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map((district) => (
                      <option
                        key={district.districtId}
                        value={district.districtId}
                      >
                        {district.districtName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Phường/Xã *</label>
                  <select
                    name="ward"
                    value={formData.ward}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.district}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map((ward) => (
                      <option key={ward.wardId} value={ward.wardId}>
                        {ward.wardName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Địa chỉ chi tiết *</label>
                  <input
                    type="text"
                    name="streetAddress"
                    value={formData.streetAddress}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ chi tiết"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Thông tin phòng trọ</h3>
                <div className="form-group">
                  <label>Tiêu đề *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Nhập tiêu đề bài đăng"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Giá phòng (VNĐ) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Nhập giá phòng"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Diện tích (m²) *</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Nhập diện tích"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số người tối đa *</label>
                  <input
                    type="number"
                    name="maxOccupants"
                    value={formData.maxOccupants}
                    onChange={handleInputChange}
                    placeholder="Nhập số người tối đa"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả chi tiết về phòng trọ"
                    rows="4"
                  />
                </div>
              </div>
            </div>

            {/* Cột phải - Upload ảnh và video */}
            <div className="right-column">
              <div className="form-section">
                <h3>Hình ảnh phòng trọ</h3>
                <div className="image-upload-container">
                  <div className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      id="image-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="image-upload" className="upload-button">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>Tải ảnh lên</span>
                      <small>Tối đa 5 ảnh</small>
                    </label>
                  </div>

                  <div className="image-preview-container">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="image-preview-item">
                        <img src={url} alt={`Preview ${index + 1}`} />
                        <button
                          className="remove-image"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Video phòng trọ</h3>
                <div className="video-upload-container">
                  <div className="video-upload-area">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      id="video-upload"
                      style={{ display: "none" }}
                    />
                    <label htmlFor="video-upload" className="upload-button">
                      <i className="fas fa-video"></i>
                      <span>Tải video lên</span>
                      <small>Tối đa 1 video</small>
                    </label>
                  </div>

                  <div className="video-preview-container">
                    {videoPreviewUrls.map((url, index) => (
                      <div key={index} className="video-preview-item">
                        <video src={url} controls />
                        <button
                          className="remove-video"
                          onClick={() => handleRemoveVideo(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Nội thất phòng</h3>
                <div className="furniture-checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="airConditioner"
                      checked={furniture.airConditioner}
                      onChange={handleFurnitureChange}
                    />
                    Điều hòa
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="fridge"
                      checked={furniture.fridge}
                      onChange={handleFurnitureChange}
                    />
                    Tủ lạnh
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="kitchen"
                      checked={furniture.kitchen}
                      onChange={handleFurnitureChange}
                    />
                    Bếp
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="bed"
                      checked={furniture.bed}
                      onChange={handleFurnitureChange}
                    />
                    Giường
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="wardrobe"
                      checked={furniture.wardrobe}
                      onChange={handleFurnitureChange}
                    />
                    Tủ quần áo
                  </label>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="popup-footer">
            <button
              className="submit-button"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng bài"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostPopup;
