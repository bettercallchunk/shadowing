"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AudioPlayerProps {
  audioPath: string;
}

export function AudioPlayer({ audioPath }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [abLoop, setAbLoop] = useState<{ start: number | null; end: number | null }>({
    start: null,
    end: null
  });
  const [abLoopPlaying, setAbLoopPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      setCurrentTime(current);

      // A-B循环逻辑
      if (abLoop.end !== null && current >= abLoop.end) {
        audio.currentTime = abLoop.start || 0;
      }
    };

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setAbLoopPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [abLoop]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleABLoopPlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (abLoopPlaying) {
      audio.pause();
      setAbLoopPlaying(false);
      setIsPlaying(false);
    } else {
      // 跳到A点开始播放
      if (abLoop.start !== null) {
        audio.currentTime = abLoop.start;
      }
      audio.play();
      setAbLoopPlaying(true);
      setIsPlaying(true);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = newSpeed;
    setSpeed(newSpeed);
    localStorage.setItem("playbackSpeed", String(newSpeed));
  };

  const setPointA = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAbLoop({ ...abLoop, start: audio.currentTime });
  };

  const setPointB = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setAbLoop({ ...abLoop, end: audio.currentTime });
  };

  const clearABLoop = () => {
    setAbLoop({ start: null, end: null });
    setAbLoopPlaying(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <Card className="p-6">
      <audio ref={audioRef} src={audioPath} />

      <div className="space-y-4">
        {/* 进度条 */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center">
          <Button
            onClick={togglePlay}
            size="lg"
            className="w-20 h-20 rounded-full"
          >
            {isPlaying ? "暂停" : "播放"}
          </Button>
        </div>

        {/* 倍速选择 */}
        <div className="flex justify-center gap-2 flex-wrap">
          {speeds.map((s) => (
            <Button
              key={s}
              variant={speed === s ? "default" : "outline"}
              size="sm"
              onClick={() => changeSpeed(s)}
            >
              {s}x
            </Button>
          ))}
        </div>

        {/* A-B循环 */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={setPointA}>
            设置 A点 {abLoop.start !== null && `(${formatTime(abLoop.start)})`}
          </Button>
          <Button variant="outline" size="sm" onClick={setPointB}>
            设置 B点 {abLoop.end !== null && `(${formatTime(abLoop.end)})`}
          </Button>
          {(abLoop.start !== null || abLoop.end !== null) && (
            <>
              <Button variant="destructive" size="sm" onClick={clearABLoop}>
                清除
              </Button>
              <Button
                variant={abLoopPlaying ? "default" : "secondary"}
                size="sm"
                onClick={toggleABLoopPlay}
                disabled={abLoop.start === null || abLoop.end === null}
              >
                {abLoopPlaying ? "暂停A-B循环" : "播放A-B循环"}
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
