"use client";

import { materials } from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [selectedPart, setSelectedPart] = useState<string>("All");

  const filteredMaterials = selectedPart === "All"
    ? materials
    : materials.filter(m => m.part === selectedPart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-800">雅思口语影子跟读</h1>
        <p className="text-center text-gray-600 mb-8">选择素材开始练习</p>

        {/* 分类筛选按钮 */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {["All", "Part1", "Part2", "Part3"].map((part) => (
            <Button
              key={part}
              variant={selectedPart === part ? "default" : "outline"}
              onClick={() => setSelectedPart(part)}
              className="min-w-[80px]"
            >
              {part}
            </Button>
          ))}
        </div>

        {/* 素材列表 */}
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMaterials.map((material) => (
            <Link key={material.id} href={`/practice/${material.id}`}>
              <Card className="p-5 hover:shadow-lg transition-all cursor-pointer hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {material.part}
                    </span>
                    <h2 className="text-xl font-semibold mt-3 mb-2 text-gray-800">{material.title}</h2>
                    {material.text && (
                      <p className="text-gray-600 text-sm line-clamp-2">{material.text}</p>
                    )}
                  </div>
                  {material.duration && (
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">{material.duration}s</span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
