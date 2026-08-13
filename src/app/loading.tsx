export default function RootLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full bg-primary/20" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        جار التحميل...
      </p>
    </div>
  );
}
