
import React, { useState } from 'react';
import type { Script } from '../types';
import { generateScript } from '../services/geminiService';
import Loader from './Loader';

interface ScriptGeneratorProps {
  onScriptGenerated: (script: Script) => void;
}

const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onScriptGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Cinematic');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scriptStyles = ['Cinematic', 'Documentary', 'Vlog', 'Commercial', 'Sci-Fi', 'Fantasy', 'Comedy'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Vui lòng nhập ý tưởng kịch bản.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const script = await generateScript(prompt, style);
      onScriptGenerated(script);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-8 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-400">Tạo Kịch Bản Video với AI</h2>
      <p className="text-center text-gray-400 mb-8">
        Nhập ý tưởng chính của bạn, chọn phong cách, và AI sẽ tự động tạo ra một kịch bản chi tiết với các nhân vật và phân cảnh.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-lg shadow-2xl">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Ý tưởng kịch bản
          </label>
          <textarea
            id="prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-white placeholder-gray-500"
            placeholder="Ví dụ: Một chú mèo phi hành gia khám phá một hành tinh làm bằng kẹo."
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
            Phong cách kịch bản
          </label>
          <select
            id="style"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-white"
            disabled={isLoading}
          >
            {scriptStyles.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? (
              <>
                <Loader size="5" />
                <span className="ml-2">Đang tạo kịch bản...</span>
              </>
            ) : (
              'Tạo Kịch Bản'
            )}
          </button>
        </div>
        
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </form>
    </div>
  );
};

export default ScriptGenerator;
