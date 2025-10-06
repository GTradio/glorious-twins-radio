import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-gray-200", className)}
			{...props}
		/>
	);
}

export function SkeletonCard() {
	return (
		<div className="bg-white rounded-lg overflow-hidden shadow-lg">
			<Skeleton className="h-48 w-full" />
			<div className="p-6 space-y-3">
				<Skeleton className="h-6 w-3/4" />
				<Skeleton className="h-4 w-full" />
				<div className="flex items-center justify-between pt-2">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-9 w-28" />
				</div>
			</div>
		</div>
	);
}

export function SkeletonTable() {
	return (
		<div className="bg-white rounded-lg shadow-sm overflow-hidden">
			<div className="p-4 space-y-3">
				{[...Array(5)].map((_, i) => (
					<div key={i} className="flex items-center space-x-4">
						<Skeleton className="h-12 flex-1" />
					</div>
				))}
			</div>
		</div>
	);
}

export function SkeletonNewsCard() {
	return (
		<div className="relative overflow-hidden rounded-lg bg-gray-900">
			<Skeleton className="aspect-w-16 aspect-h-12 min-h-[200px]" />
		</div>
	);
}
