import { useState, useEffect } from 'react';
import type { AddressData } from '../../type';
import DropDown from './dropdown';
import { getToken } from '../../utils/auth';

const token = getToken();

const priceOptions = [
  { label: '1 triệu - 2 triệu', value: { min: 1, max: 2 } },
  { label: '2 triệu - 4 triệu', value: { min: 2, max: 4 } },
  { label: '4 triệu - 8 triệu', value: { min: 4, max: 8 } },
  { label: 'Lớn hơn 8 triệu', value: { min: 8, max: null } },
];

interface Filter {
  provinceId: string;
  districtId: string;
  wardId: string;
  minPrice: number | string | null;
  maxPrice: number | string | null;
}

interface SearchProps {
  setFilter: (filter: Filter) => void;
}

const Search = ({ setFilter }: SearchProps) => {
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
  const [selectedPrice, setSelectedPrice] = useState(priceOptions[0].value);

  const [dropdownOpen, setDropdownOpen] = useState({
    province: false,
    district: false,
    ward: false,
    price: false,
  });

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

  const toggleDropdown = (type: keyof typeof dropdownOpen) => {
    setDropdownOpen({
      province: false,
      district: false,
      ward: false,
      price: false,
      [type]: !dropdownOpen[type],
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.dropdown-container')) {
        setDropdownOpen({
          province: false,
          district: false,
          ward: false,
          price: false,
        });
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
        {/* Giá tiền */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Giá tiền
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow focus:outline-none"
              onClick={() => toggleDropdown('price')}
            >
              <span>
                {
                  priceOptions.find(
                    (opt) =>
                      opt.value.min === selectedPrice.min &&
                      opt.value.max === selectedPrice.max,
                  )?.label
                }
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  dropdownOpen.price ? 'rotate-180' : ''
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
            {dropdownOpen.price && (
              <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                {priceOptions.map((opt) => (
                  <li
                    key={opt.label}
                    onClick={() => {
                      setSelectedPrice(opt.value);
                      toggleDropdown('price');
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {/* Button tìm kiếm */}
        <button
          className="w-full mt-4 bg-blue-600 text-white font-bold px-4 py-3 rounded-lg shadow hover:bg-blue-700 transition"
          type="button"
          onClick={() => {
            setFilter({
              provinceId: selectedProvince?.provinceId || '',
              districtId: selectedDistrict?.districtId || '',
              wardId: selectedWard?.wardId || '',
              minPrice: selectedPrice.min || '',
              maxPrice: selectedPrice.max || '',
            });
          }}
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default Search;
