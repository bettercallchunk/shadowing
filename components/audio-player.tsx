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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

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

  const changeSpeed = (newSpeed: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = newSpeed;
    setSpeed(newSpeed);
    localStorage.setItem("playbackSpeed", String(newSpeed));
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
      </div>
    </Card>
  );
}
