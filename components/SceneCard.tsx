import React, { useState, useEffect } from 'react';
import type { Scene, AspectRatio } from '../types';
import { generateVideoForScene } from '../services/geminiService';
import Loader from './Loader';

interface SceneCardProps {
  scene: Scene;
  aspectRatio: AspectRatio;
  startRendering: boolean;
  onRenderError: (errorMsg: string) => void;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, aspectRatio, startRendering, onRenderError }) => {
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (startRendering && !isRendering && !videoUrl && !error) {
      const renderVideo = async () => {
        setIsRendering(true);
        setError(null);
        setProgress(0);
        try {
          const url = await generateVideoForScene(scene.veoPrompt, aspectRatio, setProgress);
          setVideoUrl(url);
          setProgress(100);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định khi tạo video.';
            setError(errorMessage);
            onRenderError(`Phân cảnh ${scene.sceneNumber}: ${errorMessage}`);
        } finally {
          setIsRendering(false);
        }
      };
      renderVideo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startRendering]);

  const loadingMessages = [
      "Đang khởi tạo máy quay...",
      "AI đang tập trung sáng tạo...",
      "Sắp xếp các điểm ảnh thành kiệt tác...",
      "Thêm chút hiệu ứng đặc biệt...",
      "Đang hoàn tất những cảnh quay cuối...",
  ];
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  
  useEffect(() => {
      let interval: number;
      if (isRendering) {
        interval = window.setInterval(() => {
            setLoadingMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 5000);
      }
      return () => {
          if (interval) clearInterval(interval);
      };
  }, [isRendering]);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-indigo-500/30">
      <div className="p-6">
        <h4 className="text-lg font-bold text-indigo-400 mb-2">Phân cảnh {scene.sceneNumber}: {scene.setting}</h4>
        <p className="text-sm text-gray-400 mb-4">{scene.description}</p>
        <p className="text-xs italic text-gray-500 bg-gray-900 p-2 rounded-md">
            <strong>Prompt cho Veo:</strong> {scene.veoPrompt}
        </p>
      </div>
      <div className="bg-gray-900/50 p-6 min-h-[250px] flex items-center justify-center">
        {isRendering && (
          <div className="text-center w-full">
            <div className="relative inline-flex items-center justify-center mb-4">
              <Loader size="20" />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-300">{Math.round(progress)}%</span>
              </div>
            </div>
            <p className="text-indigo-300 font-medium">Đang render video...</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-2">
                <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-gray-400">{loadingMessage}</p>
          </div>
        )}
        {error && (
            <div className="text-center text-red-400">
                <p><strong>Lỗi!</strong></p>
                <p className="text-sm">{error}</p>
            </div>
        )}
        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className={`w-full rounded-md aspect-[${aspectRatio.replace(':', '/')}]`}
          >
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
        )}
        {!isRendering && !error && !videoUrl && (
            <div className="text-center text-gray-500">
                <p>Chờ tạo video...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default SceneCard;