import { InkSvg } from './Ink';

type IconProps = { className?: string; size?: number };

export function CoinIcon({ className, size = 16 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 20 20" className={className}>
      <ellipse cx="10" cy="10" rx="8" ry="7.5" fill="#ffba38" stroke="#7a4d00" strokeWidth="1" />
      <ellipse cx="10" cy="10" rx="5" ry="4.6" fill="none" stroke="#7a4d00" strokeWidth="0.7" />
      <path d="M9 7 L 9 13 M 11 7 L 11 13 M 8 9 L 12 9 M 8 11 L 12 11" stroke="#7a4d00" strokeWidth="0.8" fill="none" />
    </InkSvg>
  );
}

export function GemIcon({ className, size = 16 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 20 20" className={className}>
      <path d="M4 8 L 10 2 L 16 8 L 10 18 Z" fill="#d2bcfa" stroke="#4f3d72" strokeWidth="0.8" />
      <path d="M4 8 L 16 8 M 10 2 L 10 18 M 7 8 L 10 14 L 13 8" stroke="#4f3d72" strokeWidth="0.6" fill="none" />
    </InkSvg>
  );
}

export function HeartIcon({ className, size = 16, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <InkSvg size={size} viewBox="0 0 20 20" className={className}>
      <path
        d="M10 17 C 4 12, 2 8, 4 5 C 6 2, 9 4, 10 6 C 11 4, 14 2, 16 5 C 18 8, 16 12, 10 17 Z"
        fill={filled ? '#00dfc1' : 'transparent'}
        stroke={filled ? '#007a68' : '#49454e'}
        strokeWidth="1"
      />
    </InkSvg>
  );
}

export function ChevronLeft({ className, size = 20 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 20 20" className={className}>
      <path d="M13 4 L 6 10 L 13 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </InkSvg>
  );
}

export function LockIcon({ className, size = 28 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 28 28" className={className}>
      <path d="M8 12 L 8 9 C 8 5, 11 3, 14 3 C 17 3, 20 5, 20 9 L 20 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5" y="12" width="18" height="13" rx="1.5" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="14" cy="18" rx="1.9" ry="1.7" fill="currentColor" />
      <path d="M14 19 L 14 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </InkSvg>
  );
}

export function SparkIcon({ className, size = 18 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 20 20" className={className}>
      <path d="M10 2 L 11 9 L 18 10 L 11 11 L 10 18 L 9 11 L 2 10 L 9 9 Z" fill="currentColor" />
    </InkSvg>
  );
}

export function GearIcon({ className, size = 20 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3 L 13.2 5.4 L 15.9 5 L 16.4 7.6 L 18.8 8.8 L 18.1 11.4 L 20 13.4 L 18.1 15.4 L 18.8 18 L 16.4 19.2 L 15.9 21.8 L 13.2 21.4 L 12 23.8 L 10.8 21.4 L 8.1 21.8 L 7.6 19.2 L 5.2 18 L 5.9 15.4 L 4 13.4 L 5.9 11.4 L 5.2 8.8 L 7.6 7.6 L 8.1 5 L 10.8 5.4 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="12" cy="13.4" rx="3.2" ry="2.8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </InkSvg>
  );
}

export function MenuIcon({ className, size = 20 }: IconProps) {
  return (
    <InkSvg size={size} viewBox="0 0 24 24" className={className}>
      <path d="M4 7 L 20 8 M 4 13 L 20 12 M 4 18 L 20 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    </InkSvg>
  );
}

export function StarIcon({ className, size = 24, filled = true }: IconProps & { filled?: boolean }) {
  return (
    <InkSvg size={size} viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3 L 14.8 9.6 L 22 10.4 L 16.4 14.8 L 18.2 21.6 L 12 18 L 5.8 21.6 L 7.6 14.8 L 2 10.4 L 9.2 9.6 Z"
        fill={filled ? '#ffd799' : 'transparent'}
        stroke={filled ? '#7a4d00' : '#49454e'}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </InkSvg>
  );
}
