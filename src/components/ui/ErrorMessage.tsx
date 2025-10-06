import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
	message?: string;
	onRetry?: () => void;
	className?: string;
}

export default function ErrorMessage({
	message = "Something went wrong. Please try again.",
	onRetry,
	className = "",
}: ErrorMessageProps) {
	return (
		<div
			className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}
		>
			<div className="bg-red-50 rounded-full p-3 mb-4">
				<AlertCircle className="w-8 h-8 text-red-500" />
			</div>
			<h3 className="text-lg font-semibold text-gray-900 mb-2">
				Oops! Something went wrong
			</h3>
			<p className="text-gray-600 text-center mb-6 max-w-md">{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
				>
					<RefreshCw className="w-4 h-4" />
					Try Again
				</button>
			)}
		</div>
	);
}
