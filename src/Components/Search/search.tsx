import { useState, useEffect } from 'react';
import type { AddressData } from '../../type';
import DropDown from './dropdown';
import { getToken } from '../../utils/auth';

const token = getToken();

const Search = () => {
  const [provinces, setProvinces] = useState<AddressData[]>([]);
  const [districts, setDistricts] = useState<AddressData[]>([]);
  const [wards, setWards] = useState<AddressData[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<AddressData | null>(
    null,
  );
  const [selectedDistrict, setSelectedDistrict] = useState<AddressData | null>(
    null,
  );
  const [selectedWard, setSelectedWard] = useState<AddressData | null>(null);

  const [dropdownOpen, setDropdownOpen] = useState({
    province: false,
    district: false,
    ward: false,
  });
  const [fullAddress, setFullAddress] = useState<string>('Chưa chọn địa chỉ');

  // Fetch provinces
  useEffect(() => {
    fetch('http://localhost:8080/api/provinces/getAll', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProvinces(Array.isArray(data) ? data : []))
      .catch(() => setProvinces([]));
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    if (!selectedProvince?.provinceId) return;
    setSelectedDistrict(null);
    setSelectedWard(null);
    setWards([]);
    fetch(
      `http://localhost:8080/api/districts/getByProvince/${selectedProvince.provinceId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => res.json())
      .then((data) => setDistricts(Array.isArray(data) ? data : []))
      .catch(() => setDistricts([]));
  }, [selectedProvince]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (!selectedDistrict?.districtId) return;
    setSelectedWard(null);
    fetch(
      `http://localhost:8080/api/wards/getByDistrict/${selectedDistrict.districtId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
      .then((res) => res.json())
      .then((data) => setWards(Array.isArray(data) ? data : []))
      .catch(() => setWards([]));
  }, [selectedDistrict]);

  // Cập nhật địa chỉ khi cả ba cấp đều được chọn
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      setFullAddress(
        [
          selectedWard.wardName,
          selectedDistrict.districtName,
          selectedProvince.provinceName,
        ].join(', '),
      );
    } else {
      setFullAddress('Chưa chọn đầy đủ địa chỉ');
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  const toggleDropdown = (type: keyof typeof dropdownOpen) => {
    setDropdownOpen({
      province: false,
      district: false,
      ward: false,
      [type]: !dropdownOpen[type],
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown-container')) {
        setDropdownOpen({ province: false, district: false, ward: false });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const dropdownConfigs = [
    {
      type: 'province' as const,
      label: 'Tỉnh/Thành phố',
      data: provinces,
      selected: selectedProvince,
      onSelect: setSelectedProvince,
      disabled: false,
      loading: false,
      isOpen: dropdownOpen.province,
    },
    {
      type: 'district' as const,
      label: 'Quận/Huyện',
      data: districts,
      selected: selectedDistrict,
      onSelect: setSelectedDistrict,
      disabled: !selectedProvince,
      loading: false,
      isOpen: dropdownOpen.district,
    },
    {
      type: 'ward' as const,
      label: 'Phường/Xã',
      data: wards,
      selected: selectedWard,
      onSelect: setSelectedWard,
      disabled: !selectedDistrict,
      loading: false,
      isOpen: dropdownOpen.ward,
    },
  ];

  return (
    <div className="flex justify-center items-start py-1 text-gray-800 font-sans min-h-screen">
      <div className="space-y-3 w-[320px] dropdown-container bg-white rounded-xl shadow p-6">
        {dropdownConfigs.map((config) => (
          <DropDown
            key={config.type}
            {...config}
            toggleDropdown={toggleDropdown}
          />
        ))}
        <div className="mt-6">
          <label className="block mb-1 font-medium text-gray-700">
            Địa chỉ đã chọn:
          </label>
          <p className="border rounded-lg px-4 py-3 bg-gray-100">
            {fullAddress}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Search;
