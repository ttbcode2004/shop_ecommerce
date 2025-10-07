import { X } from "lucide-react";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  titleConfirm = "Xóa",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-sm shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 hover:bg-slate-100 rounded-full p-1"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-semibold text-red-600 mb-2">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a12 12 0 00-12 12h4z"
                ></path>
              </svg>
            )}
            {titleConfirm}
          </button>
        </div>
      </div>
    </div>
  );
}
