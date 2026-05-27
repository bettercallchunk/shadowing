"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Play, Pause, GitCompare } from "lucide-react";

interface Recording {
  id: string;
  blob: Blob;
  duration: number;
  url: string;
}

interface RecorderProps {
  onCompare?: (recordingUrl: string) => void;
}

export function Recorder({ onCompare }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const newRecording: Recording = {
          id: Date.now().toString(),
          blob,
          duration,
          url
        };
        setRecordings((prev) => [...prev, newRecording]);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("无法访问麦克风:", error);
      alert("无法访问麦克风，请检查权限设置");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setIsRecording(false);
  };

  const playRecording = (recording: Recording) => {
    if (playingId === recording.id) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(recording.url);
      audioRef.current = audio;
      audio.onended = () => {
        setPlayingId(null);
        audioRef.current = null;
      };
      audio.play();
      setPlayingId(recording.id);
    }
  };

  const deleteRecording = (id: string) => {
    setRecordings((prev) => {
      const recording = prev.find(r => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.url);
      }
      return prev.filter(r => r.id !== id);
    });
    if (playingId === id) {
      setPlayingId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* 录音时长显示 */}
        <div className="text-center">
          <div className="text-4xl font-mono font-bold text-gray-800">
            {formatTime(duration)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            {isRecording ? "录音中..." : "准备录音"}
          </div>
        </div>

        {/* 录音按钮 */}
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="lg"
            variant={isRecording ? "destructive" : "default"}
            className="w-32 h-32 rounded-full text-lg"
          >
            {isRecording ? "停止录音" : "开始录音"}
          </Button>
        </div>

        {/* 录音列表 */}
        {recordings.length > 0 && (
          <div className="space-y-2 mt-6">
            <h3 className="font-semibold text-gray-700">录音列表</h3>
            {recordings.map((recording) => (
              <div
                key={recording.id}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
              >
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => playRecording(recording)}
                >
                  {playingId === recording.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <span className="flex-1 text-sm">{formatTime(recording.duration)}</span>
                {onCompare && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCompare(recording.url)}
                    title="对比播放"
                  >
                    <GitCompare className="w-4 h-4 text-blue-500" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteRecording(recording.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
