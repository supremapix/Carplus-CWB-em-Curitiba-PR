import React from 'react';

interface TireTreadDividerProps {
  className?: string;
  inverted?: boolean;
}

export default function TireTreadDivider({ className = '', inverted = false }: TireTreadDividerProps) {
  return (
    <div className={`w-full overflow-hidden select-none relative ${className}`} aria-hidden="true">
      {/* Faixa texturizada com marca de banda de rodagem */}
      <div 
        className={`h-4 w-full ${inverted ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-950 border-zinc-900'} border-t border-b relative flex items-center justify-center`}
      >
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #F5A623 0, #F5A623 3px, transparent 3px, transparent 12px), repeating-linear-gradient(-45deg, #F5A623 0, #F5A623 3px, transparent 3px, transparent 12px)'
          }}
        />
        {/* Linha central sutil */}
        <div className="h-[1px] w-full bg-[#F5A623]/30 z-10" />
      </div>
    </div>
  );
}
