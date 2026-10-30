export default function GlassCard({ children, className = '', glow = false }) {
  return (
    <div
      className={`glass rounded-2xl ${glow ? 'shadow-glowCyan' : ''} ${className}`}
    >
      {children}
    </div>
  );
}