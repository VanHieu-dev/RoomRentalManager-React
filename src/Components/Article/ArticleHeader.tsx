import React from 'react';

interface ArticleHeaderProps {
  title: string;
  price: number;
  address: string;
  utilities: string[];
  services: string[];
  facilities: string[];
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  title,
  price,
  address,
  utilities,
  services,
  facilities,
}) => (
  <div className="p-4">
    <h1 className="text-xl font-bold text-black">{title}</h1>
    <p className="mt-2 text-black">{address}</p>
    <p className="text-black">
      🏠 Nội thất:{'  '}
      {utilities.length > 0 ? utilities.join(', ') : 'Không có thông tin'}
    </p>
    <div className="flex flex-col gap-2 mt-2">
      {services.length > 0 &&
        services.map((service, index) => (
          <p
            key={index}
            className="text-black"
          >
            + {service}
          </p>
        ))}
    </div>
    <div className="flex flex-col gap-2 mt-2">
      {facilities.length > 0 &&
        facilities.map((facility, index) => (
          <p
            key={index}
            className="text-black"
          >
            + {facility}
          </p>
        ))}
    </div>
    <p className="mt-2 text-lg text-black">
      Giá: {(price / 1000000).toFixed(1)} Triệu
    </p>
  </div>
);

export default ArticleHeader;
