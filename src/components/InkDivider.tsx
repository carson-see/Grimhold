// The hairline divider used under headings and below input labels — a
// tapered ink line that fades at both ends.

type Tone = 'primary' | 'outline' | 'secondary';

const STOP_BY_TONE: Record<Tone, string> = {
  primary: 'rgba(0, 223, 193, 0.5)',
  secondary: 'rgba(255, 215, 153, 0.5)',
  outline: 'rgba(73, 69, 78, 0.6)',
};

export function InkDivider({ tone = 'primary', widthClass = 'w-20', className }: {
  tone?: Tone;
  widthClass?: string;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto h-px ${widthClass} ${className ?? ''}`}
      style={{
        backgroundImage: `linear-gradient(90deg, transparent 0%, ${STOP_BY_TONE[tone]} 50%, transparent 100%)`,
      }}
    />
  );
}
