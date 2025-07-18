const RoomCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md mb-8 w-[672px] mx-auto border border-gray-100 flex flex-col animate-pulse">
    {/* Header */}

    <div className="flex items-center gap-3 px-6 pt-6 pb-2">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-100 rounded" />
      </div>
    </div>
    {/* Title */}
    <div className="px-6 pb-2">
      <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
    </div>
    {/* Gallery giống RoomCard thật */}
    <div className="px-6">
      <div className="w-full flex gap-2 mb-4 h-[340px]">
        {/* Ảnh/video lớn bên trái */}
        <div className="flex-1 h-full rounded-lg bg-gray-200" />
        {/* 2 ảnh nhỏ bên phải */}
        <div className="flex flex-col gap-2 w-1/2 max-w-[48%]">
          <div className="flex-1 rounded-lg bg-gray-200" />
          <div className="flex-1 rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
    {/* Info */}
    <div className="px-6 pb-4">
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-1/2 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-1/3 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-1/4 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-2/3 bg-gray-100 rounded" />
    </div>
    {/* Actions */}
    <div className="flex border-t px-6 py-3 gap-32">
      <div className="h-4 w-16 bg-gray-100 rounded" />
      <div className="h-4 w-20 bg-gray-100 rounded" />
    </div>
  </div>
);

export default RoomCardSkeleton;
