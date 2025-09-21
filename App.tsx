import React, { useState, useCallback } from 'react';
import { GenerationOptions, GenerationResult, WritingStyle, ContentBlock } from './types';
import { WRITING_STYLES } from './constants';
import * as geminiService from './services/geminiService';
import Header from './components/Header';
import ResultCard from './components/ResultCard';
import LoadingSpinner from './components/LoadingSpinner';
import TranslateModal from './components/TranslateModal';

const App: React.FC = () => {
  const [idea, setIdea] = useState<string>('');
  const [options, setOptions] = useState<GenerationOptions>({
    script: false,
    title: false,
    description: false,
    tags: false,
  });
  const [scriptLength, setScriptLength] = useState<number>(1500);
  const [writingStyle, setWritingStyle] = useState<string>(WRITING_STYLES[0].value);
  const [temperature, setTemperature] = useState<number>(0.8);
  
  const initialContentBlock: ContentBlock = { original: '', display: '' };
  const [results, setResults] = useState<GenerationResult>({
    script: { ...initialContentBlock },
    title: { ...initialContentBlock },
    description: { ...initialContentBlock },
    tags: { ...initialContentBlock },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRegenerating, setIsRegenerating] = useState({ script: false, title: false, description: false, tags: false });
  const [error, setError] = useState<string | null>(null);

  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [translationTarget, setTranslationTarget] = useState<{ type: keyof GenerationResult; content: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleOptionChange = (option: keyof GenerationOptions) => {
    setOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const handleSubmit = async () => {
    if (!idea.trim()) {
      setError('Vui lòng nhập ý tưởng video của bạn.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setResults({
      script: { ...initialContentBlock },
      title: { ...initialContentBlock },
      description: { ...initialContentBlock },
      tags: { ...initialContentBlock },
    });

    try {
      let scriptContent = '';
      if (options.script) {
        const selectedStyle = WRITING_STYLES.find(s => s.value === writingStyle);
        if(selectedStyle) {
            scriptContent = await geminiService.generateScript(idea, scriptLength, selectedStyle, temperature);
        }
        setResults(prev => ({ ...prev, script: { original: scriptContent, display: scriptContent } }));
      }
      
      let titleContent = '';
      if (options.title) {
        titleContent = await geminiService.generateTitle(idea, scriptContent);
        setResults(prev => ({ ...prev, title: { original: titleContent, display: titleContent } }));
      }

      let descriptionContent = '';
      if (options.description) {
        descriptionContent = await geminiService.generateDescription(idea, scriptContent);
        setResults(prev => ({ ...prev, description: { original: descriptionContent, display: descriptionContent } }));
      }

      if (options.tags) {
        const tagsContent = await geminiService.generateTags(idea, titleContent, descriptionContent);
        setResults(prev => ({ ...prev, tags: { original: tagsContent, display: tagsContent } }));
      }

    } catch (e) {
      console.error(e);
      setError('Đã xảy ra lỗi không mong muốn khi tạo nội dung.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegenerate = useCallback(async <T extends 'script' | 'title' | 'description' | 'tags'>(type: T) => {
    setIsRegenerating(prev => ({ ...prev, [type]: true }));
    let newContent = '';

    const ideaSource = idea.trim();
    if (!ideaSource) {
      setError('Vui lòng nhập ý tưởng để sáng tạo lại.');
      setIsRegenerating(prev => ({ ...prev, [type]: false }));
      return;
    }
    setError(null);

    try {
        switch (type) {
            case 'script':
                const selectedStyle = WRITING_STYLES.find(s => s.value === writingStyle);
                if (selectedStyle) {
                    newContent = await geminiService.generateScript(ideaSource, scriptLength, selectedStyle, temperature);
                } else {
                    throw new Error("Writing style not found");
                }
                break;
            case 'title':
                newContent = await geminiService.generateTitle(ideaSource, results.script.original, true);
                break;
            case 'description':
                newContent = await geminiService.generateDescription(ideaSource, results.script.original, true);
                break;
            case 'tags':
                newContent = await geminiService.generateTags(ideaSource, results.title.original, results.description.original, true);
                break;
        }
        setResults(prev => ({ ...prev, [type]: { original: newContent, display: newContent } }));
    } catch (e) {
        console.error(`Error regenerating ${type}:`, e);
        const typeVietnamese = {
            script: 'kịch bản',
            title: 'tiêu đề',
            description: 'mô tả',
            tags: 'thẻ tags'
        };
        setError(`Không thể tạo lại ${typeVietnamese[type]}.`);
    } finally {
        setIsRegenerating(prev => ({ ...prev, [type]: false }));
    }
  }, [idea, results.script.original, results.title.original, results.description.original, scriptLength, writingStyle, temperature]);

  const handleOpenTranslateModal = useCallback((type: keyof GenerationResult) => {
    const contentToTranslate = results[type].original;
    if (!contentToTranslate) return;
    setTranslationTarget({ type, content: contentToTranslate });
    setIsTranslateModalOpen(true);
  }, [results]);

  const handleCloseTranslateModal = () => {
    setIsTranslateModalOpen(false);
    setTranslationTarget(null);
  };

  const handleTranslate = async (language: { code: string; name: string } | null) => {
    if (!translationTarget) return;

    if (language === null) { // Revert to original
        setResults(prev => ({
            ...prev,
            [translationTarget.type]: {
                ...prev[translationTarget.type],
                display: prev[translationTarget.type].original,
            }
        }));
        handleCloseTranslateModal();
        return;
    }

    setIsTranslating(true);
    try {
      const translatedText = await geminiService.translateText(translationTarget.content, language);
      setResults(prev => ({
        ...prev,
        [translationTarget.type]: {
            ...prev[translationTarget.type],
            display: translatedText,
        }
      }));
    } catch (e) {
      console.error("Translation failed:", e);
      setError("Không thể dịch nội dung.");
    } finally {
      setIsTranslating(false);
      handleCloseTranslateModal();
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {isLoading && <LoadingSpinner />}
       <TranslateModal
          show={isTranslateModalOpen}
          onClose={handleCloseTranslateModal}
          onTranslate={handleTranslate}
          isTranslating={isTranslating}
      />
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* --- Input Column --- */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-lg shadow-2xl shadow-indigo-900/20">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b-2 border-indigo-500/30 pb-2">1. Ý tưởng của bạn</h2>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="VD: Một bộ phim tài liệu về lịch sử cà phê và tác động của nó đối với văn hóa toàn cầu..."
              className="w-full h-40 p-3 bg-gray-700 border-2 border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-gray-200"
            />
             {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}

            <h2 className="text-2xl font-bold mt-6 mb-4 text-indigo-400 border-b-2 border-indigo-500/30 pb-2">2. Tùy chọn nội dung</h2>
            <div className="space-y-2">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.script}
                    onChange={() => handleOptionChange('script')}
                    className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-lg">Viết kịch bản</span>
                </label>
                {options.script && (
                  <div className="mt-2 ml-5 p-4 bg-gray-700/50 rounded-lg animate-fade-in-up">
                      <h3 className="text-md font-semibold mb-3 text-gray-300">Chi tiết kịch bản</h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="scriptLength" className="block mb-1 text-sm font-medium text-gray-400">Độ dài văn bản (số từ)</label>
                          <input
                            type="number"
                            id="scriptLength"
                            value={scriptLength}
                            onChange={(e) => setScriptLength(parseInt(e.target.value, 10))}
                            className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                         <div>
                          <label htmlFor="writingStyle" className="block mb-1 text-sm font-medium text-gray-400">Phong cách văn bản</label>
                          <select
                            id="writingStyle"
                            value={writingStyle}
                            onChange={(e) => setWritingStyle(e.target.value)}
                            className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-1 focus:ring-indigo-500"
                          >
                            {WRITING_STYLES.map((style) => (
                              <option key={style.value} value={style.value}>{style.label}</option>
                            ))}
                          </select>
                        </div>
                         <div>
                            <label htmlFor="temperature" className="block mb-1 text-sm font-medium text-gray-400">
                                Độ sáng tạo (Temperature)
                            </label>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="range"
                                    id="temperature"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={temperature}
                                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="font-mono text-sm text-indigo-300 w-8 text-center">{temperature.toFixed(1)}</span>
                            </div>
                             <p className="text-xs text-gray-500 mt-1">Giá trị cao hơn sẽ sáng tạo hơn nhưng có thể kém mạch lạc.</p>
                        </div>
                      </div>
                  </div>
                )}
              </div>
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.title}
                    onChange={() => handleOptionChange('title')}
                    className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-lg">Viết Tiêu đề</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.description}
                    onChange={() => handleOptionChange('description')}
                    className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-lg">Viết Mô tả</span>
              </label>
               <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={options.tags}
                    onChange={() => handleOptionChange('tags')}
                    className="h-5 w-5 rounded bg-gray-600 border-gray-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-800"
                  />
                  <span className="text-lg">Thẻ Tags</span>
              </label>
            </div>
             <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full mt-8 py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Tạo nội dung
            </button>
          </div>

          {/* --- Results Column --- */}
          <div className="lg:col-span-2 space-y-6">
             {options.script && <ResultCard title="Kịch bản được tạo" content={results.script.display} onRegenerate={() => handleRegenerate('script')} isRegenerating={isRegenerating.script} onTranslate={() => handleOpenTranslateModal('script')} />}
             {options.title && <ResultCard title="Tiêu đề đề xuất" content={results.title.display} onRegenerate={() => handleRegenerate('title')} isRegenerating={isRegenerating.title} onTranslate={() => handleOpenTranslateModal('title')} />}
             {options.description && <ResultCard title="Mô tả đề xuất" content={results.description.display} onRegenerate={() => handleRegenerate('description')} isRegenerating={isRegenerating.description} onTranslate={() => handleOpenTranslateModal('description')} />}
             {options.tags && <ResultCard title="Thẻ Tags đề xuất" content={results.tags.display} onRegenerate={() => handleRegenerate('tags')} isRegenerating={isRegenerating.tags} onTranslate={() => handleOpenTranslateModal('tags')} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
