import React from 'react';

interface ArticleHeaderProps {
  title: string;
  price: number;
  address: string;
  utilities: string[];
  services: string[];
  facilities: string[];
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ title, price, address, utilities, services, facilities }) => (
  <div className="p-4">
    <h1 className="text-xl font-bold">{title}</h1>
    <p className="text-gray-600 mt-2">{address}</p>
    <p className="text-gray-600">Nội thất: {utilities.join(', ') || 'Không có thông tin'}</p>
    <div className="flex flex-col space-y-2 mt-2">
      {services.length > 0 ? services.map((service, index) => (
        <p key={index} className="text-gray-700">+ {service}</p>
      )) : null}
    </div>
    <div className="flex flex-col space-y-2 mt-2">
      {facilities.length > 0 ? facilities.map((facility, index) => (
        <p key={index} className="text-gray-700">+ {facility}</p>
      )) : null}
    </div>
    <p className="mt-2 text-lg">Giá: {(price / 1000000).toFixed(1)} Triệu</p>
  </div>
);

export default ArticleHeader;