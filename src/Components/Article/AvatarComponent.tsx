import React from 'react';
import { User } from 'lucide-react';

interface AvatarComponentProps {
  name?: string;
}

const AvatarComponent: React.FC<AvatarComponentProps> = ({ name = 'Lê Văn Hiếu' }) => {
  return (
    <div className="flex items-center mb-4 space-x-2">
      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
        <User className="w-8 h-8 text-gray-600" />
      </div>
      <span className="text-black text-xl font-bold">{name}</span>
    </div>
  );
};

export default AvatarComponent;