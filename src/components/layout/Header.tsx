import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
}

export default function Header({ title, subtitle, right, left }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-black text-white border-b border-neutral-800">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {left}
          <div className="flex flex-col">
            <span className="text-lg font-semibold tracking-wide">{title}</span>
            {subtitle && <span className="text-xs text-neutral-400">{subtitle}</span>}
          </div>
        </div>
        {right && <div className="flex items-center gap-4">{right}</div>}
      </div>
    </header>
  );
}
