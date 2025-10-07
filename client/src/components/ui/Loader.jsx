import { Loader2 } from "lucide-react";

export default function Loader({ isLoading }) {
  return (
    isLoading && (
      <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50">
        <Loader2 className="animate-spin text-blue-400" size={48} />
        <span className="ml-2 text-blue-400 font-medium">Đang tải ...</span>
      </div>
    )
  );
}
