import { Suspense } from "react";
import AIRecommendContent from "./AIRecommendContent";
import { Loader2 } from "lucide-react";

export default function AIRecommendPage() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-gray-900 animate-spin mb-4" />
            <p className="text-gray-600 text-lg">로딩 중...</p>
          </div>
        </div>
      }
    >
      <AIRecommendContent />
    </Suspense>
  );
}
