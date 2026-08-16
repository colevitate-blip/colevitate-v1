export function ColevitateMark({ className = "size-6" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="Colevitate" className={`${className} object-contain`} />
  );
}
