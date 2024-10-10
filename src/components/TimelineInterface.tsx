import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@remotion/player';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig } from 'remotion';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, Upload, Share, Download, Scissors, Type, Music, Eye, EyeOff, Undo, Redo, Trash, Video, Image as ImageIcon } from 'lucide-react';

interface TimelineInterfaceProps {
  images: string[];
}

const FRAME_PER_IMAGE = 150; // 5 seconds at 30 fps

const TimelineComposition: React.FC<{ images: string[] }> = ({ images }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentImageIndex = Math.floor(frame / FRAME_PER_IMAGE) % images.length;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <img src={images[currentImageIndex]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};

const TimelineInterface: React.FC<TimelineInterfaceProps> = ({ images }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<Player>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const totalFrames = images.length * FRAME_PER_IMAGE;

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const frame = Math.floor(percentage * totalFrames);
      setCurrentFrame(frame);
      if (playerRef.current) {
        playerRef.current.seekTo(frame);
      }
    }
  };

  if (images.length === 0) {
    return <div className="text-yellow-500 p-4">No images available for the timeline.</div>;
  }

  return (
    <div className="bg-gray-900 text-gray-300 min-h-screen flex">
      {/* Image cache/browser */}
      <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Media</h2>
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img src={image} className="w-full h-auto rounded" alt={`Thumbnail ${index + 1}`} />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded">
                  <Video size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4">
          <Player
            ref={playerRef}
            component={TimelineComposition}
            inputProps={{ images }}
            durationInFrames={totalFrames}
            compositionWidth={1080}
            compositionHeight={608}
            fps={30}
            style={{
              width: '100%',
              height: 'calc(100% - 100px)',
            }}
            controls
          />
        </div>
        <div className="h-24 bg-gray-800 p-4">
          <div
            ref={timelineRef}
            className="h-8 bg-gray-700 rounded-full cursor-pointer relative"
            onClick={handleScrub}
          >
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(currentFrame / totalFrames) * 100}%` }}
            ></div>
            {/* Timeline representation */}
            {images.map((_, index) => (
              <div
                key={index}
                className="absolute top-0 bottom-0 bg-gray-600"
                style={{
                  left: `${(index * FRAME_PER_IMAGE / totalFrames) * 100}%`,
                  width: `${(FRAME_PER_IMAGE / totalFrames) * 100}%`,
                }}
              ></div>
            ))}
          </div>
          <div className="mt-4 flex justify-center space-x-4">
            <button onClick={() => setCurrentFrame(0)} className="p-2 bg-gray-700 rounded-full">
              <SkipBack size={20} />
            </button>
            <button onClick={handlePlayPause} className="p-2 bg-blue-500 rounded-full">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => setCurrentFrame(totalFrames - 1)} className="p-2 bg-gray-700 rounded-full">
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineInterface;