import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex flex-col justify-center items-center z-50">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 border-4 border-dashed rounded-full animate-spin-reverse border-purple-500"></div>
        </div>
      <p className="text-white text-lg mt-6">AI đang sáng tạo kiệt tác cho bạn...</p>
    </div>
  );
};

export default LoadingSpinner;