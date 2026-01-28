
import React, { useState } from 'react';
import { Persona } from '../types';

interface PersonaCardProps {
  persona: Persona;
  isSelected: boolean;
  onClick: () => void;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona, isSelected, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const themeColor = persona.color.split(' ')[1]; // e.g., text-orange-400

  return (
    <div 
      onClick={onClick}
      className={`relative cursor-pointer transition-all duration-500 transform p-4 border-2 rounded-xl bg-zinc-900/40 backdrop-blur-xl overflow-hidden group ${
        isSelected 
          ? `${persona.color} scale-[1.02] bg-zinc-800/60 ring-1 ring-white/10` 
          : 'border-zinc-800 text-zinc-500 opacity-70 hover:opacity-100 hover:border-zinc-600 hover:translate-y-[-2px]'
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <div className={`relative w-20 h-20 rounded-full overflow-hidden border-2 transition-all duration-500 ${isSelected ? 'border-current scale-110' : 'border-zinc-700'}`}>
          {!imgError ? (
            <img 
              src={persona.avatar} 
              alt={persona.name} 
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center bg-zinc-800 ${themeColor} font-cyber text-2xl`}>
              {persona.name[0]}
            </div>
          )}
          {isSelected && (
            <div className="absolute inset-0 bg-current/10 animate-pulse"></div>
          )}
        </div>
        
        <div className="text-center">
          <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-white' : ''}`}>{persona.name}</h3>
          <p className="text-[10px] opacity-60 mb-2 font-mono uppercase tracking-tighter">{persona.title}</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {persona.tags.map(tag => (
              <span 
                key={tag} 
                className={`text-[9px] px-2 py-0.5 rounded-full border transition-colors ${
                  isSelected ? 'border-current/30 bg-current/5' : 'border-zinc-700 bg-zinc-900'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {isSelected && (
        <div className="absolute top-2 right-2">
          <div className={`w-2 h-2 rounded-full animate-ping bg-current opacity-75`}></div>
          <div className={`absolute top-0 w-2 h-2 rounded-full bg-current shadow-[0_0_10px_currentColor]`}></div>
        </div>
      )}
    </div>
  );
};
