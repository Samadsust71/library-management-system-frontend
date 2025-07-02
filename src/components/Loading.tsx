const Loading = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="h-8 bg-accent-foreground/60 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-accent-foreground/60 rounded w-48 mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 bg-accent-foreground/60 rounded w-32 animate-pulse"></div>
      </div>

      <div className="bg-accent-foreground rounded-lg shadow-sm border border-accent-foreground/60 p-4 animate-pulse">
        <div className="h-10 bg-accent-foreground/60 rounded"></div>
      </div>

      <div className="bg-accent-foreground rounded-lg shadow-sm border border-accent-foreground/60 p-6 animate-pulse">
        <div className="h-64 bg-accent-foreground/60 rounded"></div>
      </div>
    </div>
  );
};

export default Loading;
