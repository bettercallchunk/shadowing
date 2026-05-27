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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">雅思口语素材</h1>

        {/* 分类筛选按钮 */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {["All", "Part1", "Part2", "Part3"].map((part) => (
            <Button
              key={part}
              variant={selectedPart === part ? "default" : "outline"}
              onClick={() => setSelectedPart(part)}
            >
              {part}
            </Button>
          ))}
        </div>

        {/* 素材列表 */}
        <div className="grid gap-4">
          {filteredMaterials.map((material) => (
            <Link key={material.id} href={`/practice/${material.id}`}>
              <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {material.part}
                    </span>
                    <h2 className="text-xl font-semibold mt-2">{material.title}</h2>
                    {material.text && (
                      <p className="text-gray-600 mt-2 text-sm line-clamp-2">{material.text}</p>
                    )}
                  </div>
                  {material.duration && (
                    <span className="text-sm text-gray-500">{material.duration}秒</span>
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
