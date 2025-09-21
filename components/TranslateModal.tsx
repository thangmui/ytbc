import React, { useState, useEffect } from 'react';
import { TRANSLATION_LANGUAGES } from '../constants';

interface TranslateModalProps {
  show: boolean;
  onClose: () => void;
  onTranslate: (language: { code: string; name: string } | null) => void;
  isTranslating: boolean;
}

const TranslateModal: React.FC<TranslateModalProps> = ({ show, onClose, onTranslate, isTranslating }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('original');

  useEffect(() => {
    if (show) {
      setSelectedLanguage('original');
    }
  }, [show]);

  const handleTranslateClick = () => {
    if (selectedLanguage === 'original') {
      onTranslate(null);
    } else {
      const languageToTranslate = TRANSLATION_LANGUAGES.find(lang => lang.code === selectedLanguage);
      if (languageToTranslate) {
        onTranslate(languageToTranslate);
      }
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 transform transition-all duration-300 scale-95 animate-fade-in-up">
        <h2 className="text-xl font-bold text-indigo-400 mb-4">Chọn ngôn ngữ</h2>
        <div className="space-y-3">
          <label key="original" className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50">
            <input
              type="radio"
              name="language"
              value="original"
              checked={selectedLanguage === 'original'}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="h-5 w-5 bg-gray-600 border-gray-500 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
            />
            <span>Original (Tiếng Việt)</span>
          </label>
          {TRANSLATION_LANGUAGES.map(lang => (
            <label key={lang.code} className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50">
              <input
                type="radio"
                name="language"
                value={lang.code}
                checked={selectedLanguage === lang.code}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="h-5 w-5 bg-gray-600 border-gray-500 text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-gray-800"
              />
              <span>{lang.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors">
            Hủy
          </button>
          <button
            onClick={handleTranslateClick}
            disabled={isTranslating}
            className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isTranslating && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isTranslating ? 'Đang xử lý...' : 'Xác nhận'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslateModal;
