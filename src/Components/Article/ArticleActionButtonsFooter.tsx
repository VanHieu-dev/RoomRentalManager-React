import React from 'react';
import { Heart, Phone } from 'lucide-react';

const ArticleActionButtonsFooter: React.FC = () => (
  <div className="flex justify-between items-center mt-4 text-gray-500 border-t pt-2">
    <div className="flex justify-evenly w-full">
      <button className="flex items-center space-x-1 hover:text-red-500 transition-colors">
        <Heart className="w-4 h-4" />
        <span>Lưu</span>
      </button>
      <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
        <Phone className="w-4 h-4" />
        <span>Gọi số chủ</span>
      </button>
    </div>
  </div>
);

export default ArticleActionButtonsFooter;
