const Loading = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card rounded-lg shadow-sm border p-6 animate-pulse"
          >
            <div className="h-16 bg-muted rounded"></div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-lg shadow-sm border p-6 animate-pulse">
        <div className="h-80 bg-muted rounded"></div>
      </div>
    </div>
  );
};

export default Loading;
