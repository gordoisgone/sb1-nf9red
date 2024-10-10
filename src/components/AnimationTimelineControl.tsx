import React, { useEffect, useRef, useState } from 'react';
import { Timeline, TimelineModel, TimelineOptions, TimelineRow, TimelineKeyframe } from 'animation-timeline-js';

interface Clip {
  id: string;
  type: 'image' | 'audio';
  src: string;
  start: number;
  end: number;
  track: number;
}

interface AnimationTimelineControlProps {
  clips: Clip[];
  duration: number;
  currentTime: number;
  onTimeChange: (time: number) => void;
  onClipUpdate: (updatedClip: Clip) => void;
  zoom: number;
  onClipSelect: (clip: Clip | null) => void;
}

const AnimationTimelineControl: React.FC<AnimationTimelineControlProps> = ({
  clips,
  duration,
  currentTime,
  onTimeChange,
  onClipUpdate,
  zoom,
  onClipSelect,
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineInstance = useRef<Timeline | null>(null);
  const [selectedKeyframeId, setSelectedKeyframeId] = useState<string | null>(null);

  useEffect(() => {
    if (timelineRef.current && !timelineInstance.current) {
      const options: TimelineOptions = {
        id: 'timeline',
        rowsStyle: {
          height: 40,
          marginBottom: 2,
        },
        keyframeStyle: {
          width: 10,
          height: 20,
          backgroundColor: '#4a5568',
        },
        timelineStyle: {
          backgroundColor: '#2d3748',
        },
      };

      const model: TimelineModel = { rows: [] };
      timelineInstance.current = new Timeline(options, model);

      timelineInstance.current.onTimeChanged.on((event) => {
        onTimeChange(event.val);
      });

      timelineInstance.current.onKeyframeChanged.on((event) => {
        const updatedClip = clips.find((clip) => clip.id === event.val.group);
        if (updatedClip) {
          const isStart = event.val.id === updatedClip.id;
          onClipUpdate({
            ...updatedClip,
            [isStart ? 'start' : 'end']: event.val.val,
          });
        }
      });

      timelineInstance.current.onSelected.on((event) => {
        setSelectedKeyframeId(event.added[0]);
        const selectedClip = clips.find((clip) => clip.id === event.added[0] || `${clip.id}-end` === event.added[0]);
        onClipSelect(selectedClip || null);
      });

      timelineRef.current.appendChild(timelineInstance.current.getElement());
    }

    return () => {
      if (timelineInstance.current) {
        timelineInstance.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (timelineInstance.current) {
      const rows: TimelineRow[] = [
        { id: 'image-track-1', name: 'Images 1' },
        { id: 'image-track-2', name: 'Images 2' },
        { id: 'audio-track', name: 'Audio' },
      ];

      const keyframes: TimelineKeyframe[] = clips.flatMap((clip) => [
        {
          id: clip.id,
          val: clip.start,
          rowId: getRowId(clip.track),
          group: clip.id,
          selected: selectedKeyframeId === clip.id,
        },
        {
          id: `${clip.id}-end`,
          val: clip.end,
          rowId: getRowId(clip.track),
          group: clip.id,
          selected: selectedKeyframeId === `${clip.id}-end`,
        },
      ]);

      const model: TimelineModel = {
        rows,
        keyframes,
        duration,
      };

      timelineInstance.current.setModel(model);
      timelineInstance.current.setZoom(zoom);
    }
  }, [clips, duration, zoom, selectedKeyframeId]);

  useEffect(() => {
    if (timelineInstance.current) {
      timelineInstance.current.setTime(currentTime);
    }
  }, [currentTime]);

  const getRowId = (track: number) => {
    switch (track) {
      case 0:
        return 'image-track-1';
      case 1:
        return 'image-track-2';
      case 2:
        return 'audio-track';
      default:
        return 'image-track-1';
    }
  };

  return <div ref={timelineRef} style={{ width: '100%', height: '200px' }} />;
};

export default AnimationTimelineControl;