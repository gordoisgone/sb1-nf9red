import React, { useState, useRef, useEffect } from 'react';

interface Clip {
  id: string;
  type: 'image' | 'audio';
  src: string;
  start: number;
  end: number;
  track: number;
}

interface AnimationTimelineProps {
  clips: Clip[];
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onClipUpdate: (updatedClip: Clip) => void;
  onClipSelect: (clip: Clip | null) => void;
}

const AnimationTimeline: React.FC<AnimationTimelineProps> = ({
  clips,
  duration,
  currentTime,
  onTimeChange,
  onClipUpdate,
  onClipSelect,
}) => {
  // ... (previous code remains the same)

  const handleClipClick = (e: React.MouseEvent<HTMLDivElement>, clip: Clip) => {
    e.stopPropagation();
    onClipSelect(clip);
  };

  return (
    <div className="relative">
      {/* ... (previous code remains the same) */}
      <div
        ref={timelineRef}
        className="relative w-full bg-gray-800 rounded-lg overflow-hidden"
        style={{ height: `${trackHeight * numTracks}px` }}
        onClick={() => onClipSelect(null)}
      >
        {clips.map((clip) => (
          <div
            key={clip.id}
            className={`absolute rounded-md ${
              clip.type === 'image' ? 'bg-blue-500' : 'bg-green-500'
            }`}
            style={{
              left: `${(clip.start / duration) * 100}%`,
              width: `${((clip.end - clip.start) / duration) * 100}%`,
              top: `${clip.track * trackHeight}px`,
              height: `${trackHeight - 4}px`,
            }}
            onClick={(e) => handleClipClick(e, clip)}
          >
            {/* ... (previous code remains the same) */}
          </div>
        ))}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default AnimationTimeline;