import React, { useState } from 'react';

interface ResultCardProps {
  title: string;
  content: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  onTranslate?: () => void;
}

const CopyIcon: React.FC<{ copied: boolean }> = ({ copied }) => (
  copied ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
);

const RegenerateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
    </svg>
);

const TranslateIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13-4-4m0 0l4-4m-4 4h12M17 19l4-4m0 0l-4-4m4 4H7" />
    </svg>
);

const ResultCard: React.FC<ResultCardProps> = ({ title, content, onRegenerate, isRegenerating, onTranslate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/30">
      <div className="p-4 bg-gray-700/50 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-lg font-semibold text-indigo-400">{title}</h3>
        <div className="flex items-center space-x-2">
             {onTranslate && content && (
                  <button
                      onClick={onTranslate}
                      className="p-2 rounded-md bg-gray-600 hover:bg-indigo-600 text-gray-200 transition-colors duration-200 flex items-center"
                      aria-label="Translate"
                  >
                      <TranslateIcon />
                      <span className="ml-2 text-sm">Dịch</span>
                  </button>
              )}
            {onRegenerate && (
                 <button
                    onClick={onRegenerate}
                    disabled={isRegenerating}
                    className="p-2 rounded-md bg-gray-600 hover:bg-indigo-600 text-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    aria-label="Regenerate"
                >
                    {isRegenerating ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                       <RegenerateIcon />
                    )}
                     <span className="ml-2 text-sm">Sáng tạo</span>
                 </button>
            )}
             <button
                onClick={handleCopy}
                className="p-2 rounded-md bg-gray-600 hover:bg-indigo-600 text-gray-200 transition-colors duration-200 flex items-center"
                aria-label="Copy"
            >
                <CopyIcon copied={copied}/>
                <span className="ml-2 text-sm">{copied ? 'Đã chép!' : 'Chép'}</span>
             </button>
        </div>
      </div>
      <div className="p-5 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
        {content || `Nội dung cho ${title} sẽ xuất hiện ở đây...`}
      </div>
    </div>
  );
};

export default ResultCard;