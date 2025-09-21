import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white p-6 shadow-lg shadow-indigo-500/10">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center gap-3 md:gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              YTB CREATIVE
            </h1>
        </div>
        <p className="mt-3 text-lg text-gray-300">Sáng tạo những ý tưởng điên rồ của bạn</p>
      </div>
    </header>
  );
};

export default Header;