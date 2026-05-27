"use client";

import { materials } from "@/lib/data";
import { useParams } from "next/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { Recorder } from "@/components/recorder";
import { useState } from "react";
import { Card } from "@/components/ui/card";

export default function PracticePage() {
  const params = useParams();
  const material = materials.find(m => m.id === params.id);
  const [compareRecordingUrl, setCompareRecordingUrl] = useState<string | undefined>();

  if (!material) {
    return <div>素材不存在</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="text-blue-600 hover:underline mb-4 inline-block">← 返回首页</a>

        <div className="bg-white rounded-lg shadow-md p-6">
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            {material.part}
          </span>
          <h1 className="text-2xl font-bold mt-3 mb-2">{material.title}</h1>

          {material.text && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">{material.text}</p>
            </div>
          )}

          {/* 音频播放器 */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">原声播放</h2>
            <AudioPlayer
              audioPath={material.audioPath}
              recordingUrl={compareRecordingUrl}
              materialTitle={material.title}
            />
          </div>

          {/* 录音区域 */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">跟读录音</h2>
            <Recorder onCompare={setCompareRecordingUrl} />

            {/* 对比播放提示 */}
            {compareRecordingUrl && (
              <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  ✓ 已选择录音进行对比。点击上方"同时播放原声和录音"按钮开始对比。
                  <button
                    onClick={() => setCompareRecordingUrl(undefined)}
                    className="ml-2 text-blue-600 underline"
                  >
                    取消
                  </button>
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
