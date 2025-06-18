import { useState, useEffect } from 'react';
import type { AddressData } from '../type';



const AddressDropdown = () => {
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

  // Fetch provinces
  useEffect(() => {
    (async () => {
      setLoading((l) => ({ ...l, province: true }));
      try {
        const res = await fetch('https://provinces.open-api.vn/api/p/');
        setProvinces(await res.json());
      } catch (err) {
        console.error('Error loading provinces', err);
      } finally {
        setLoading((l) => ({ ...l, province: false }));
      }
    })();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    if (!selectedProvince) return;
    (async () => {
      setLoading((l) => ({ ...l, district: true }));
      setSelectedDistrict(null);
      setSelectedWard(null);
      setWards([]);
      try {
        const res = await fetch(
          `https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`,
        );
        setDistricts((await res.json()).districts || []);
      } catch (err) {
        console.error('Error loading districts', err);
      } finally {
        setLoading((l) => ({ ...l, district: false }));
      }
    })();
  }, [selectedProvince]);

  // Fetch wards when district is selected
  useEffect(() => {
    if (!selectedDistrict) return;
    //IIFE
    (async () => {
      setLoading((l) => ({ ...l, ward: true }));
      setSelectedWard(null);
      try {
        const res = await fetch(
          `https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`,
        );
        setWards((await res.json()).wards || []);
      } catch (err) {
        console.error('Error loading wards', err);
      } finally {
        setLoading((l) => ({ ...l, ward: false }));
      }
    })();
  }, [selectedDistrict]);

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

  const renderDropdown = (
    type: 'province' | 'district' | 'ward',
    label: string,
    data: AddressData[],
    selected: AddressData | null,
    onSelect: (item: AddressData) => void,
    disabled: boolean,
  ) => (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <button
        onClick={() => !disabled && toggleDropdown(type)}
        className={`w-full flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow focus:outline-none ${
          disabled || loading[type] ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={disabled || loading[type]}
        type="button"
      >
        <span>
          {selected?.name || `Chọn ${label.toLowerCase()}`}
          {loading[type] && ' (Đang tải...)'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            dropdownOpen[type] ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {dropdownOpen[type] && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {data.map((item) => (
            <li
              key={item.code}
              onClick={() => {
                onSelect(item);
                setDropdownOpen({
                  province: false,
                  district: false,
                  ward: false,
                });
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="p-10 bg-white text-gray-800 font-sans">
      <div className="space-y-6 max-w-sm dropdown-container">
        {renderDropdown(
          'province',
          'Tỉnh/Thành phố',
          provinces,
          selectedProvince,
          setSelectedProvince,
          false,
        )}
        {renderDropdown(
          'district',
          'Quận/Huyện',
          districts,
          selectedDistrict,
          setSelectedDistrict,
          !selectedProvince,
        )}
        {renderDropdown(
          'ward',
          'Phường/Xã',
          wards,
          selectedWard,
          setSelectedWard,
          !selectedDistrict,
        )}
      </div>
    </div>
  );
};

export default AddressDropdown;
