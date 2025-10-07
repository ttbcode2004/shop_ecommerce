import { Loader2 } from "lucide-react";

export default function Loader1({ isLoading }) {
  return (
    isLoading && (
      <div className="absolute inset-0 flex items-center justify-center z-50 bg-white/60">
        <Loader2 className="animate-spin text-blue-400" size={48} />
        <span className="ml-2 text-blue-400 font-medium">Đang tải ...</span>
      </div>
    )
  );
}
