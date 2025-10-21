import React, { useState } from 'react';
import type { Script, AspectRatio } from '../types';
import SceneCard from './SceneCard';

interface VideoRendererProps {
  script: Script;
  onReset: () => void;
}

const VideoRenderer: React.FC<VideoRendererProps> = ({ script, onReset }) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isRenderingStarted, setIsRenderingStarted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleRenderAll = () => {
    setErrors([]);
    setIsRenderingStarted(true);
  };
    
  const handleRenderError = (errorMsg: string) => {
    setErrors(prev => [...prev, errorMsg]);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-indigo-400">{script.title}</h2>
        <p className="mt-2 text-md text-gray-400 max-w-3xl mx-auto">{script.description}</p>
        <button 
            onClick={onReset}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
        >
            ← Tạo kịch bản khác
        </button>
      </div>

      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm py-4 mb-8">
        <div className="max-w-4xl mx-auto bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <label className="font-medium text-gray-300">Khung hình:</label>
                <div className="flex rounded-md shadow-sm">
                    <button onClick={() => setAspectRatio('16:9')} disabled={isRenderingStarted} className={`px-4 py-2 text-sm font-medium rounded-l-md ${aspectRatio === '16:9' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} disabled:opacity-50`}>Ngang (16:9)</button>
                    <button onClick={() => setAspectRatio('9:16')} disabled={isRenderingStarted} className={`px-4 py-2 text-sm font-medium rounded-r-md ${aspectRatio === '9:16' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'} disabled:opacity-50`}>Dọc (9:16)</button>
                </div>
            </div>
            <button
                onClick={handleRenderAll}
                disabled={isRenderingStarted}
                className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isRenderingStarted ? 'Đang xử lý...' : 'Tạo Video cho Tất Cả Phân Cảnh'}
            </button>
        </div>
        {errors.length > 0 && (
            <div className="max-w-4xl mx-auto mt-4 bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-md">
                <h3 className="font-bold">Đã xảy ra lỗi:</h3>
                <ul className="mt-2 list-disc list-inside text-sm">
                    {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {script.scenes.map((scene) => (
          <SceneCard
            key={scene.sceneNumber}
            scene={scene}
            aspectRatio={aspectRatio}
            startRendering={isRenderingStarted}
            onRenderError={handleRenderError}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoRenderer;