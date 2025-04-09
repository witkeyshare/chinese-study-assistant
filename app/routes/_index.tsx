import { useState, useEffect } from 'react';
import type { MetaFunction } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json, LoaderFunction, ActionFunction, redirect } from "@remix-run/node";
import { CharacterService } from "~/services/CharacterService";
import StrokeAnimation from "~/components/StrokeAnimation";



interface LoaderData {
  historyCharacters: string[];
}
export const loader: LoaderFunction = async ({ request }) => {

  try {
    const characterService = await CharacterService.initialize();
    const historyCharacters = await characterService.getTopViewHistory();
    return json<any>({ historyCharacters});
  } catch (error) {
    console.error('初始化CharacterService失败:', error);
    return json<any>({ historyCharacters: [], error: '服务暂时不可用' });
  }
};


export const meta: MetaFunction = () => {
  return [
    { title: "汉字学习小助手" },
    { name: "description", content: "查询汉字的拼音、部首、笔画、笔顺、组词、字义和相似字" },
  ];
};

export default function Index() {
  const { historyCharacters } = useLoaderData<LoaderData>();
  const [character, setCharacter] = useState('');
  const [searchedChar, setSearchedChar] = useState('');
  const [charInfo, setCharInfo] = useState<any>(null);
  const [availableChars, setAvailableChars] = useState<string[]>([]);
  const [showAllChars, setShowAllChars] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setAvailableChars(historyCharacters);
  }, [historyCharacters]);
  
  // 查询汉字信息
  const handleSearch = async () => {
    if (character.trim()) {
      const char = character.trim()[0]; // 只取第一个字符
      setSearchedChar(char);
      setLoading(true); // 开始加载
      console.log('查询汉字:', char);
      try {
        const response = await fetch(`/api/word?character=${char}`);
        const info = await response.json();
        setCharInfo(info);
      } catch (error) {
        console.error('获取汉字信息失败:', error);
        setCharInfo(null);
      } finally {
        setLoading(false); // 结束加载
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // 点击相似汉字
  const handleSimilarClick = async (char: string) => {
    setCharacter(char);
    setSearchedChar(char);
    setLoading(true); // 开始加载
    try {
      const response = await fetch(`/api/word?character=${char}`);
      const info = await response.json();
      setCharInfo(info);
    } catch (error) {
      console.error('获取汉字信息失败:', error);
      setCharInfo(null);
    } finally {
      setLoading(false); // 结束加载
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-6 px-4 sm:py-8 relative">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-3"></div>
            <p className="text-lg font-medium text-blue-700">加载中...</p>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">汉字学习小助手</h1>
          <p className="text-indigo-600 font-medium">学习汉字的拼音、部首、笔画、笔顺、组词和字义</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8 border-2 border-purple-100">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={character}
              onChange={(e) => setCharacter(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入汉字"
              className="flex-1 px-4 py-3 text-lg border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 placeholder-purple-300"
              maxLength={1}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-md transition-all duration-200 text-lg font-medium"
            >
              查询
            </button>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {availableChars.slice(0, showAllChars ? availableChars.length : 5).map(char => (
              <button 
                key={char}
                onClick={() => handleSimilarClick(char)}
                className="w-10 h-10 flex text-gray-800 items-center justify-center text-lg border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {char}
              </button>
            ))}
            {availableChars.length > 5 && (
              <button 
                onClick={() => setShowAllChars(!showAllChars)}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium"
              >
                {showAllChars ? '收起' : '更多汉字...'}
              </button>
            )}
          </div>
        </div>

        {searchedChar && (
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 border-2 border-yellow-100">
            <h2 className="text-4xl font-bold text-center mb-6 text-yellow-600">{searchedChar}</h2>
            
            {!charInfo && (
              <div className="text-center py-8">
                <p className="text-pink-500 text-lg">未找到该汉字的信息</p>
                <div className="mt-4">
                  <p className="text-sm text-indigo-600 font-medium mb-3">可以尝试以下汉字：</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {availableChars.map(char => (
                      <button 
                        key={char}
                        onClick={() => handleSimilarClick(char)}
                        className="w-12 h-12 flex items-center text-gray-800 justify-center text-xl border-2 border-pink-200 rounded-lg hover:bg-pink-100 transition-colors shadow-sm"
                      >
                        {char}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {charInfo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="border-2 border-blue-100 rounded-xl p-4 bg-blue-50">
                  <h3 className="font-bold text-blue-800 mb-3 text-lg">基本信息</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="text-blue-600 font-medium mr-2">拼音：</span>
                      <span className="text-lg text-gray-800">{charInfo.pinyin}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-600 font-medium mr-2">部首：</span>
                      <span className="text-lg text-gray-800">{charInfo.radical}</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-blue-600 font-medium mr-2">笔画数：</span>
                      <span className="text-lg text-gray-800">{charInfo.strokes}</span>
                    </li>
                  </ul>
                </div>
                
                <div className="border-2 border-purple-100 rounded-xl p-4 bg-purple-50">
                  <h3 className="font-bold text-purple-700 mb-3 text-lg">笔顺动画</h3>
                  <div className="flex items-center justify-center">
                    <StrokeAnimation 
                      character={searchedChar} 
                      strokeOrder={charInfo.strokeOrder} 
                    />
                  </div>
                </div>
                
                <div className="border-2 border-green-100 rounded-xl p-4 bg-green-50">
                  <h3 className="font-bold text-green-700 mb-3 text-lg">字义</h3>
                  {charInfo.meaning.length > 0 ? (
                    <ul className="space-y-2">
                      {charInfo.meaning.map((meaning: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700 mr-2 flex-shrink-0">{index + 1}</span>
                          <span className="text-gray-800">{meaning}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">暂无字义信息</p>
                  )}
                </div>
                
                <div className="border-2 border-pink-100 rounded-xl p-4 bg-pink-50">
                  <h3 className="font-bold text-pink-700 mb-3 text-lg">组词</h3>
                  {charInfo.words.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {charInfo.words.map((word: string, index: number) => (
                        <span key={index} className="px-3 py-2 bg-white rounded-lg text-gray-800 border border-pink-200 shadow-sm">
                          {word}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无组词信息</p>
                  )}
                </div>
                
                <div className="border-2 border-yellow-100 rounded-xl p-4 bg-yellow-50 md:col-span-2">
                  <h3 className="font-bold text-yellow-800 mb-3 text-lg">相似汉字</h3>
                  {charInfo.similar.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {charInfo.similar.map((char: string, index: number) => (
                        <button 
                          key={index} 
                          onClick={() => handleSimilarClick(char)}
                          className="w-12 h-12 flex items-center text-gray-800  justify-center text-xl border-2 border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors shadow-sm"
                        >
                          {char}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">暂无相似汉字信息</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
