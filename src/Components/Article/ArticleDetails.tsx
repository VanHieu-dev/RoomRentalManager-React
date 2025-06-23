import React from 'react';

interface ArticleDetailsProps {
  area: number;
  utilities: string[];
}

const ArticleDetails: React.FC<ArticleDetailsProps> = ({ area, utilities }) => (
  <div className="p-4 mt-4">
    <p>Diện tích: {area} m²</p>
  </div>
);

export default ArticleDetails;