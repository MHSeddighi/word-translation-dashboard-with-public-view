function SpinnerLoader({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className={`spinner`}></div>
    </div>
  );
}

export default SpinnerLoader;
