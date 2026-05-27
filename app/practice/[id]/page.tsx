import { materials } from "@/lib/data";
import { notFound } from "next/navigation";
import { AudioPlayer } from "@/components/audio-player";
import { Recorder } from "@/components/recorder";

export default async function PracticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const material = materials.find(m => m.id === id);

  if (!material) {
    notFound();
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
            <AudioPlayer audioPath={material.audioPath} />
          </div>

          {/* 录音区域 */}
          <div className="border-t pt-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">跟读录音</h2>
            <Recorder />
          </div>
        </div>
      </div>
    </div>
  );
}
