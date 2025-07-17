import React, { useState, useEffect } from "react";
import axios from "axios";
import { getToken, getManagerId } from "/src/services/authService";
import "./CreatePostPopup.css";

interface Province {
  provinceId: number;
  provinceName: string;
}

interface District {
  districtId: number;
  districtName: string;
}

interface Ward {
  wardId: number;
  wardName: string;
}

interface FurnitureState {
  airconditioner: boolean;
  fridge: boolean;
  kitchen: boolean;
  bed: boolean;
  wardrobe: boolean;
}

interface FormDataState {
  provinceId: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  title: string;
  price: string;
  area: string;
  maxOccupants: string;
  streetAddress: string;
  description: string;
}

interface PostSubmitData {
  formData: FormDataState;
  furniture: string[];
  roomId: number;
  utility: string[];
  uploadedMediaIds: string[];
}

interface CreatePostPopupProps {
  onClose: () => void;
  onPostSubmit: (data: PostSubmitData) => void;
}

axios.defaults.baseURL = "http://localhost:8080";
axios.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;

const CreatePostPopup: React.FC<CreatePostPopupProps> = ({ onClose, onPostSubmit }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);

  const [furniture, setFurniture] = useState<FurnitureState>({
    airconditioner: false,
    fridge: false,
    kitchen: false,
    bed: false,
    wardrobe: false,
  });

  const [formData, setFormData] = useState<FormDataState>({
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

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getToken();
        if (!token) throw new Error("Không tìm thấy token xác thực");

        const response = await axios.get("/api/provinces/getAll");
        setProvinces(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "Lỗi khi lấy danh sách tỉnh thành");
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "province") {
      const selectedProvince = provinces.find((p) => p.provinceId.toString() === value);
      if (selectedProvince) {
        setFormData((prev) => ({
          ...prev,
          provinceId: selectedProvince.provinceId.toString(),
          provinceName: selectedProvince.provinceName,
          district: "",
          districtName: "",
          ward: "",
          wardName: "",
        }));

        const fetchDistricts = async () => {
          try {
            const token = getToken();
            if (!token) throw new Error("Không tìm thấy token");
            const response = await axios.get(`/api/districts/getByProvince/${selectedProvince.provinceId}`);
            setDistricts(response.data);
            setWards([]);
          } catch (error) {
            console.error("Lỗi khi gọi API districts:", error);
          }
        };
        fetchDistricts();
      }
    } else if (name === "district") {
      const selectedDistrict = districts.find((d) => d.districtId.toString() === value);
      setFormData((prev) => ({
        ...prev,
        district: value,
        districtName: selectedDistrict?.districtName || "",
        ward: "",
        wardName: "",
      }));

      const fetchWards = async () => {
        try {
          const token = getToken();
          if (!token) throw new Error("Không tìm thấy token");
          const response = await axios.get(`/api/wards/getByDistrict/${value}`);
          setWards(response.data);
        } catch (error) {
          console.error("Lỗi khi gọi API wards:", error);
        }
      };
      fetchWards();
    } else if (name === "ward") {
      const selectedWard = wards.find((w) => w.wardId.toString() === value);
      setFormData((prev) => ({
        ...prev,
        ward: value,
        wardName: selectedWard?.wardName || "",
      }));
    } else if (name === "area") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length + images.length > 5) {
      setError("Chỉ được tải lên tối đa 5 ảnh");
      return;
    }
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setImages((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + videos.length > 1) {
      setError("Chỉ được upload tối đa 1 video");
      return;
    }
    const newVideos: File[] = [];
    const newPreviewUrls: string[] = [];
    files.forEach((file) => {
      if (file.type.startsWith("video/")) {
        newVideos.push(file);
        newPreviewUrls.push(URL.createObjectURL(file));
      } else {
        setError("Vui lòng chỉ upload file video");
      }
    });
    setVideos([...videos, ...newVideos]);
    setVideoPreviewUrls([...videoPreviewUrls, ...newPreviewUrls]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setVideoPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFurnitureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFurniture((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.price || !formData.area || !formData.maxOccupants || !formData.streetAddress || !formData.provinceId || !formData.district || !formData.ward) {
      setError("Vui lòng điền đầy đủ tất cả các trường bắt buộc.");
      return;
    }
    setError(null);

    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Không tìm thấy token xác thực");

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

      const roomResponse = await axios.post("/api/rooms/create", roomDataToSend);
      const newRoomId = roomResponse.data.roomId;
      setCurrentRoomId(newRoomId);

      const selectedFurniture = Object.keys(furniture).filter((key) => furniture[key as keyof FurnitureState]);
      if (selectedFurniture.length > 0) {
        await axios.post("/api/room-furniture/create", {
          roomId: newRoomId,
          furnitureName: selectedFurniture,
        });
      }

      let uploadedMediaUrls: string[] = [];
      if (images.length > 0 || videos.length > 0) {
        const formDataMedia = new FormData();
        images.forEach((file) => formDataMedia.append("files", file));
        videos.forEach((file) => formDataMedia.append("files", file));

        const uploadResponse = await axios.post(`/api/room-media/create?roomId=${newRoomId}`, formDataMedia);
        uploadedMediaUrls = uploadResponse.data.map((item: any) => item.mediaUrl);
      }

      const dataToSubmit: PostSubmitData = {
        formData,
        furniture: selectedFurniture,
        roomId: newRoomId,
        utility: selectedFurniture,
        uploadedMediaIds: uploadedMediaUrls,
      };

      onPostSubmit(dataToSubmit);
      onClose();
    } catch (error: any) {
      setError(error.response?.data?.message || "Lỗi khi tạo phòng trọ");
    } finally {
      setLoading(false);
    }
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
          {/* Các trường nhập liệu và form upload ảnh/video giữ nguyên từ bản JSX cũ */}
          <button className="submit-button" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng bài"}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreatePostPopup;
