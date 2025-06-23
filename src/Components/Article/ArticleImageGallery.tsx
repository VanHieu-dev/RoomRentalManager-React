import React from 'react';

interface ArticleImageGalleryProps {
  images: string[];
  onImageClick: (index: number) => void;
  showAllImages: boolean;
  onViewMore: () => void;
}

const ArticleImageGallery: React.FC<ArticleImageGalleryProps> = ({ images, onImageClick, showAllImages, onViewMore }) => {
  const displayImages = showAllImages ? images : images.slice(0, 4);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-2">
        {displayImages.map((img, index) => (
          <img key={index} src={img} alt="property" className="w-full h-48 object-cover cursor-pointer rounded" onClick={() => onImageClick(index)} />
        ))}
      </div>
      {!showAllImages && images.length > 4 && (
        <button className="mt-2 text-blue-500 underline" onClick={onViewMore}>Xem thêm</button>
      )}
    </div>
  );
};

export default ArticleImageGallery;