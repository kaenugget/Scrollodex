import { cn } from "@/lib/utils";
const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12"
};
export function LoadingSpinner({ size = "md", className, text, fullScreen = false }) {
    const spinner = (<div className={cn("animate-spin rounded-full border-2 border-white border-t-transparent", sizeClasses[size], className)}/>);
    if (fullScreen) {
        return (<div className="fixed inset-0 scrollodex-bg flex items-center justify-center z-50">
        <div className="text-center">
          <div className="mb-6">
            <div className="animate-spin rounded-full border-4 border-white border-t-transparent h-16 w-16 mx-auto"></div>
          </div>
          {text && (<>
              <div className="text-2xl font-bold scrollodex-text-white-bold mb-2">{text}</div>
              <div className="text-lg scrollodex-text-white">Please wait...</div>
            </>)}
        </div>
      </div>);
    }
    if (text) {
        return (<div className="text-center">
        {spinner}
        <div className="text-neutral-400 mt-2">{text}</div>
      </div>);
    }
    return spinner;
}
//# sourceMappingURL=loading-spinner.js.map