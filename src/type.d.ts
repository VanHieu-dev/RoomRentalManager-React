export interface AddressData {
  code: string;
  name: string;
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