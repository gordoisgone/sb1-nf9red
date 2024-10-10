import React, { useRef, useEffect, useState } from 'react';

interface Clip {
  id: string;
  type: 'video' | 'audio';
  src: string;
  start: number;
  end: number;
  track: number;
}

interface TimelineProps {
  clips: Clip[];
  duration: number;
  currentTime: number;
  onClipMove: (clipId: string, newStart: number, newTrack: number) => void;
  onClipResize: (clipId: string, newStart: number, newEnd: number) => void;
  onTimeChange: (newTime: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ clips, duration, currentTime, onClipMove, onClipResize, onTimeChange }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const trackHeight = 80; // Increased track height
  const pixelsPerSecond = 50; // Adjusted to fit the timeline
  const totalWidth = duration * pixelsPerSecond;
  const numTracks = 3; // Three tracks

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && timelineRef.current) {
      const rect = timelineRef.current.getBoundingClientRect();
      const newTime = Math.max(0, Math.min(duration, (e.clientX - rect.left) / pixelsPerSecond));
      onTimeChange(newTime);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove as any);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove as any);
    };
  }, [isDragging]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const milliseconds = Math.floor((time % 1) * 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
  };

  const renderClip = (clip: Clip) => {
    const left = clip.start * pixelsPerSecond;
    const width = (clip.end - clip.start) * pixelsPerSecond;
    const top = clip.track * trackHeight;

    return (
      <div
        key={clip.id}
        className={`absolute rounded-md ${clip.type === 'video' ? 'bg-gray-700' : 'bg-gray-600'}`}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${trackHeight - 4}px`,
        }}
      >
        <img src={clip.src} alt={clip.id} className="w-full h-full object-cover rounded-md" />
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-50 text-gray-200 text-xs p-1">
          {clip.id}
        </div>
      </div>
    );
  };

  const renderTickMarks = () => {
    const tickMarks = [];
    const tickInterval = 1; // 1 second interval

    for (let i = 0; i <= duration; i += tickInterval) {
      const left = i * pixelsPerSecond;
      tickMarks.push(
        <div key={i} className="absolute top-0 h-4 border-l border-gray-700" style={{ left: `${left}px` }}>
          <div className="absolute top-4 left-0 transform -translate-x-1/2 text-xs text-gray-400">
            {formatTime(i)}
          </div>
        </div>
      );
    }

    return tickMarks;
  };

  return (
    <div className="relative w-full overflow-x-auto" style={{ height: `${numTracks * trackHeight + 40}px` }}>
      <div className="sticky top-0 left-0 right-0 h-8 bg-gray-800 z-10">
        {renderTickMarks()}
      </div>
      <div
        ref={timelineRef}
        className="relative"
        style={{ width: `${totalWidth}px`, height: `${numTracks * trackHeight}px` }}
        onMouseDown={handleMouseDown}
      >
        {[...Array(numTracks)].map((_, index) => (
          <div
            key={index}
            className="absolute w-full bg-gray-800"
            style={{
              top: `${index * trackHeight}px`,
              height: `${trackHeight}px`,
            }}
          >
            <div className="absolute left-0 top-0 bottom-0 bg-gray-700 px-2 flex items-center w-24">
              <span className="text-xs text-gray-300">Track {index + 1}</span>
            </div>
          </div>
        ))}
        {clips.map(renderClip)}
        <div
          ref={scrubberRef}
          className="absolute top-0 w-0.5 bg-red-500 h-full z-20"
          style={{ left: `${currentTime * pixelsPerSecond}px` }}
        />
      </div>
      <div className="sticky bottom-0 left-0 right-0 h-8 bg-gray-800 flex items-center px-2 z-10">
        <div className="text-gray-200 text-sm">{formatTime(currentTime)}</div>
      </div>
    </div>
  );
};

export default Timeline;