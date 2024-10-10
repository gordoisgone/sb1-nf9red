import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings, Maximize2, Minimize2 } from 'lucide-react';
import Timeline from './Timeline';

interface OptimizedVideoEditorProps {
  initialMedia: string[];
}

const OptimizedVideoEditor: React.FC<OptimizedVideoEditorProps> = ({ initialMedia }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [clips, setClips] = useState<any[]>([]);
  const [mediaLibrary, setMediaLibrary] = useState(initialMedia);
  const [currentClipIndex, setCurrentClipIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialClips = initialMedia.map((src, index) => ({
      id: `clip-${index + 1}`,
      type: 'video',
      src,
      start: index * 5,
      end: (index + 1) * 5,
      track: 0,
    }));
    setClips(initialClips);
    setDuration(initialClips.length * 5);
  }, [initialMedia]);

  useEffect(() => {
    if (videoRef.current && clips.length > 0) {
      videoRef.current.src = clips[currentClipIndex].src;
      videoRef.current.load();
    }
  }, [currentClipIndex, clips]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const newTime = currentClipIndex * 5 + videoRef.current.currentTime;
      setCurrentTime(newTime);
      if (newTime >= clips[currentClipIndex].end) {
        if (currentClipIndex < clips.length - 1) {
          setCurrentClipIndex(currentClipIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }
    }
  };

  const handleTimeChange = (newTime: number) => {
    const clipIndex = Math.floor(newTime / 5);
    const clipTime = newTime % 5;
    setCurrentClipIndex(clipIndex);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = clipTime;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handleClipMove = (clipId: string, newStart: number, newTrack: number) => {
    setClips(clips.map(clip =>
      clip.id === clipId ? { ...clip, start: newStart, track: newTrack } : clip
    ));
  };

  const handleClipResize = (clipId: string, newStart: number, newEnd: number) => {
    setClips(clips.map(clip =>
      clip.id === clipId ? { ...clip, start: newStart, end: newEnd } : clip
    ));
  };

  return (
    <div ref={containerRef} className="bg-gray-950 text-gray-200 min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-gray-900 p-2 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <span className="text-green-400 font-bold text-xl italic">Nerate</span>
          <nav className="space-x-4">
            <button className="text-gray-400 hover:text-gray-200">File</button>
            <button className="text-gray-400 hover:text-gray-200">Image</button>
            <button className="text-gray-400 hover:text-gray-200">Video</button>
            <button className="text-gray-400 hover:text-gray-200">Voice</button>
            <button className="text-gray-400 hover:text-gray-200">Sound</button>
            <button className="text-gray-400 hover:text-gray-200">Music</button>
            <button className="text-gray-400 hover:text-gray-200">Assistant</button>
            <button className="text-gray-400 hover:text-gray-200">Plugins</button>
            <button className="text-gray-400 hover:text-gray-200">View</button>
          </nav>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-1 bg-gray-800 rounded-full"><Settings size={16} /></button>
          <button className="p-1 bg-gray-800 rounded-full" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Media Library */}
        <div className="w-64 bg-gray-900 p-4 flex flex-col overflow-y-auto border-r border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Media Library</h2>
          <div className="grid grid-cols-2 gap-2">
            {mediaLibrary.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Media ${index + 1}`}
                className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
          </div>
          <button className="mt-4 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold py-2 px-4 rounded">
            Upload Media
          </button>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Video Preview */}
          <div className="relative flex-grow bg-black">
            <video
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-gray-800 bg-opacity-50 rounded-full p-2">
              <SkipBack size={20} className="cursor-pointer" onClick={() => handleTimeChange(Math.max(0, currentTime - 5))} />
              <button onClick={handlePlayPause} className="p-2 bg-gray-700 rounded-full">
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <SkipForward size={20} className="cursor-pointer" onClick={() => handleTimeChange(Math.min(duration, currentTime + 5))} />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-900 border-t border-gray-800 h-64">
            <Timeline
              clips={clips}
              duration={duration}
              currentTime={currentTime}
              onClipMove={handleClipMove}
              onClipResize={handleClipResize}
              onTimeChange={handleTimeChange}
            />
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-12 bg-gray-900 flex flex-col items-center py-2 border-l border-gray-800">
          <div className="flex flex-col space-y-2">
            <button className="p-1 bg-gray-800 rounded-full" onClick={handleMuteToggle}>
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 -rotate-90 mt-16 mb-16"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedVideoEditor;