export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-24 h-24 bg-unsw-yellow border-4 border-unsw-charcoal shadow-brutal animate-pulse" />
        <div className="absolute inset-0 border-4 border-unsw-charcoal animate-ping opacity-20" />
      </div>
      <div className="font-mono font-bold uppercase text-unsw-charcoal text-xl tracking-widest animate-pulse">
        Loading...
      </div>
    </div>
  );
}
