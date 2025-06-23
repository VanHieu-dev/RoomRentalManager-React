import React, { useState, useEffect } from "react";
import "./Lightbox.css";

const Lightbox = ({ images, initialIndex, onClose }) => {
  console.log("Rendering Lightbox component...");
  console.log("Lightbox received images:", images);
  console.log("Lightbox received initialIndex:", initialIndex);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);

  useEffect(() => {
    console.log("Lightbox useEffect running.");
    console.log("Current index in useEffect:", currentIndex);
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleNext();
      } else if (event.key === "ArrowLeft") {
        handlePrev();
      } else if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex, images.length, onClose]);

  const handlePrev = () => {
    console.log("Previous button clicked.");
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    console.log("Next button clicked.");
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Ngăn chặn click từ đóng lightbox */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <button className="nav-button prev" onClick={handlePrev}>
          &#10094;
        </button>
        {isVideo(images[currentIndex]) ? (
          <video
            src={images[currentIndex]}
            controls
            className="lightbox-image"
            style={{ background: "#000" }}
          />
        ) : (
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="lightbox-image"
          />
        )}
        <button className="nav-button next" onClick={handleNext}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default Lightbox;
