import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4 text-primary">
        <Loader2 className="w-12 h-12 animate-spin text-accent" />
        <p className="text-lg font-medium text-gray-600 animate-pulse">Loading content...</p>
      </div>
    </div>
  );
}
