import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-4">
        <h1 className="text-2xl font-bold text-center">影子跟读 - Day 2 测试</h1>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Card 组件测试</h2>
          <p className="text-gray-600 mb-4">如果你能看到这个卡片，说明 Card 组件工作正常。</p>
          <Button>点击测试按钮</Button>
        </Card>
      </div>
    </div>
  );
}
