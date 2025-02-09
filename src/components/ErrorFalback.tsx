import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("Uncaught error:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-lg p-6 max-w-md w-full space-y-6 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Oops! Something went wrong</h2>
        <p className="text-zinc-400">
          We"re sorry, but we"ve encountered an unexpected error.
        </p>
        <div className="space-y-2">
          <button
            onClick={resetErrorBoundary}
            className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition duration-200"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}