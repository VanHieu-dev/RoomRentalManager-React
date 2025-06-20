import type { AddressData, DropdownProps } from "../../type";

const DropDown = ({
  type,
  label,
  data,
  selected,
  onSelect,
  disabled,
  loading,
  isOpen,
  toggleDropdown,
}: DropdownProps) => {
  const getId = (item: AddressData): string => {
    if (type === 'province') return item.provinceId ?? '';
    if (type === 'district') return item.districtId ?? '';
    if (type === 'ward') return item.wardId ?? '';
    return '';
  };

  const getName = (item: AddressData): string => {
    return item.provinceName || item.districtName || item.wardName || '';
  };

  return (
    <div className="relative">
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <button
        onClick={() => !disabled && toggleDropdown(type)}
        className={`w-full flex justify-between items-center border rounded-lg px-4 py-3 bg-white shadow-sm hover:shadow focus:outline-none ${
          disabled || loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={disabled || loading}
        type="button"
      >
        <span>
          {getName(selected || {}) || `Chọn ${label.toLowerCase()}`}
          {loading && ' (Đang tải...)'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
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
      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {data.map((item) => (
            <li
              key={`${getId(item)}`}
              onClick={() => {
                onSelect(item);
                toggleDropdown(type);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {getName(item)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropDown;