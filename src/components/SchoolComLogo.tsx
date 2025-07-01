
import { School } from 'lucide-react';
import Link from 'next/link';

interface SchoolComLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export function SchoolComLogo({ size = 24, className, showText = true }: SchoolComLogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 text-accent ${className}`}>
      <School size={size} strokeWidth={2.5} />
      {showText && <span className="font-headline text-xl font-bold">SchoolCom</span>}
    </Link>
  );
}
