
export const isVideo = (url: string) => /\.(mp4|mov|webm|avi|mkv)$/i.test(url);

export function renderGallery(images: { mediaUrl: string }[], setShowSlideshow: (v: boolean) => void, setCurrentIndex: (v: number) => void) {
  if (images.length === 0) return null;
  return (
    <div className="w-full h-64 flex gap-2 mb-4">
      <div
        className="flex-1 h-full rounded-lg overflow-hidden cursor-pointer"
        onClick={() => { setShowSlideshow(true); setCurrentIndex(0); }}
      >
        {images[0] && isVideo(images[0].mediaUrl) ? (
          <video src={images[0].mediaUrl} controls className="object-cover w-full h-full" />
        ) : (
          <img src={images[0].mediaUrl} alt="room" className="object-cover w-full h-full" />
        )}
      </div>
      <div className="flex flex-col gap-2 w-1/2 max-w-[48%]">
        {[images[1], images[2]].map((item, idx) =>
          item ? (
            <div
              key={idx}
              className="flex-1 rounded-lg overflow-hidden cursor-pointer relative"
              onClick={() => { setShowSlideshow(true); setCurrentIndex(idx + 1); }}
            >
              {isVideo(item.mediaUrl) ? (
                <video src={item.mediaUrl} controls className="object-cover w-full h-full" />
              ) : (
                <img src={item.mediaUrl} alt="room" className="object-cover w-full h-full" />
              )}
              {idx === 1 && images.length > 3 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-2xl font-bold">
                  +{images.length - 2}
                </div>
              )}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}

export function renderSlideshow(images: { mediaUrl: string }[], currentIndex: number, setCurrentIndex: (v: number) => void, setShowSlideshow: (v: boolean) => void) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      onClick={() => setShowSlideshow(false)}
    >
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
        onClick={e => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + images.length) % images.length); }}
      >
        &#8592;
      </button>
      {images[currentIndex] && isVideo(images[currentIndex].mediaUrl) ? (
        <video
          src={images[currentIndex].mediaUrl}
          controls
          className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          onClick={e => e.stopPropagation()}
        />
      ) : (
        <img
          src={images[currentIndex]?.mediaUrl}
          alt="slideshow"
          className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-lg"
          onClick={e => e.stopPropagation()}
        />
      )}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2"
        onClick={e => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % images.length); }}
      >
        &#8594;
      </button>
      <button
        className="absolute top-6 right-6 bg-white/80 rounded-full p-2"
        onClick={e => { e.stopPropagation(); setShowSlideshow(false); }}
      >
        Đóng
      </button>
    </div>
  );
}