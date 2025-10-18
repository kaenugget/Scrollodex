import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8",
  xl: "h-12 w-12"
};

export function LoadingSpinner({ 
  size = "md", 
  className, 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={cn("animate-spin rounded-full border-2 border-gray-300 border-t-blue-600", sizeClasses[size], className)} />
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {spinner}
          {text && (
            <>
              <div className="text-xl font-semibold text-gray-900 mt-4 mb-2">{text}</div>
              <div className="text-gray-600">Please wait...</div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (text) {
    return (
      <div className="text-center">
        {spinner}
        <div className="text-gray-600 mt-2">{text}</div>
      </div>
    );
  }

  return spinner;
}
