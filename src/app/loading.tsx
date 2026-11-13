export default function Loading() {
  return (
    <div className="mx-auto max-w-[1600px] px-5 py-10 md:px-8 md:py-16">
      <div className="h-3 w-28 animate-pulse bg-line/50" />
      <div className="mt-6 h-12 w-3/4 max-w-2xl animate-pulse bg-line/40 md:h-20" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-64 animate-pulse border border-line/50 bg-panel/30"
          />
        ))}
      </div>
      <p className="mt-8 font-mono text-[8px] uppercase tracking-[0.2em] text-muted">
        Retrieving archive records
      </p>
    </div>
  );
}
