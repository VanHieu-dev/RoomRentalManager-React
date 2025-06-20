import { useState, useEffect } from 'react';
import type { AddressData } from '../../type';
import DropDown from './dropdown'; 
import { getToken } from '../../utils/auth';

const token = getToken();

const Search = () => {
  const [provinces, setProvinces] = useState<AddressData[]>([]);
  const [districts, setDistricts] = useState<AddressData[]>([]);
  const [wards, setWards] = useState<AddressData[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<AddressData | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<AddressData | null>(null);
  const [selectedWard, setSelectedWard] = useState<AddressData | null>(null);

  const [loading, setLoading] = useState({
    province: false,
    district: false,
    ward: false,
  });
  const [dropdownOpen, setDropdownOpen] = useState({
    province: false,
    district: false,
    ward: false,
  });

  const [fullAddress, setFullAddress] = useState<string>('Chưa chọn địa chỉ');

  // Fetch provinces
  useEffect(() => {
    (async () => {
      setLoading((l) => ({ ...l, province: true }));
      try {
        const res = await fetch('http://localhost:8080/api/provinces/getAll', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setProvinces(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách tỉnh/thành phố', err);
      } finally {
        setLoading((l) => ({ ...l, province: false }));
      }
    })();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    if (!selectedProvince?.provinceId) return;
    (async () => {
      setLoading((l) => ({ ...l, district: true }));
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
      try {
        const res = await fetch(
          `http://localhost:8080/api/districts/getByProvince/${selectedProvince.provinceId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        setDistricts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách quận/huyện', err);
      } finally {
        setLoading((l) => ({ ...l, district: false }));
      }
    })();
  }, [selectedProvince]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (!selectedDistrict?.districtId) return;
    (async () => {
      setLoading((l) => ({ ...l, ward: true }));
      setSelectedWard(null);
      try {
        const res = await fetch(
          `http://localhost:8080/api/wards/getByDistrict/${selectedDistrict.districtId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await res.json();
        console.log(data);
        
        setWards(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách phường/xã', err);
      } finally {
        setLoading((l) => ({ ...l, ward: false }));
      }
    })();
  }, [selectedDistrict]);

  // Cập nhật địa chỉ khi cả ba cấp đều được chọn
  useEffect(() => {
    if (selectedProvince && selectedDistrict && selectedWard) {
      const address = [
        selectedWard.wardName,
        selectedDistrict.districtName,
        selectedProvince.provinceName
      ].join(', ');
      setFullAddress(address);
      console.log('Địa chỉ đầy đủ:', address);
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

  // Cấu hình cho các dropdown
  const dropdownConfigs = [
    {
      type: 'province' as const,
      label: 'Tỉnh/Thành phố',
      data: provinces,
      selected: selectedProvince,
      onSelect: setSelectedProvince,
      disabled: false,
      loading: loading.province,
      isOpen: dropdownOpen.province,
    },
    {
      type: 'district' as const,
      label: 'Quận/Huyện',
      data: districts,
      selected: selectedDistrict,
      onSelect: setSelectedDistrict,
      disabled: !selectedProvince,
      loading: loading.district,
      isOpen: dropdownOpen.district,
    },
    {
      type: 'ward' as const,
      label: 'Phường/Xã',
      data: wards,
      selected: selectedWard,
      onSelect: setSelectedWard,
      disabled: !selectedDistrict,
      loading: loading.ward,
      isOpen: dropdownOpen.ward,
    },
  ];

  return (
    <div className="p-10 bg-white text-gray-800 font-sans">
      <div className="space-y-6 max-w-sm dropdown-container">
        {dropdownConfigs.map((config) => (
          <DropDown
            key={config.type}
            type={config.type}
            label={config.label}
            data={config.data}
            selected={config.selected}
            onSelect={config.onSelect}
            disabled={config.disabled}
            loading={config.loading}
            isOpen={config.isOpen}
            toggleDropdown={toggleDropdown}
          />
        ))}
        <div className="mt-6">
          <label className="block mb-1 font-medium text-gray-700">Địa chỉ đã chọn:</label>
          <p className="border rounded-lg px-4 py-3 bg-gray-100">{fullAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default Search;