export interface AddressData {
  provinceId?: string;
  provinceName?: string;
  districtId?: string;
  districtName?: string;
  wardId?: string;
  wardName?: string;
}

export interface DropdownProps {
  type: 'province' | 'district' | 'ward';
  label: string;
  data: AddressData[];
  selected: AddressData | null;
  onSelect: (item: AddressData) => void;
  disabled: boolean;
  loading: boolean;
  isOpen: boolean;
  toggleDropdown: (type: 'province' | 'district' | 'ward') => void;
}