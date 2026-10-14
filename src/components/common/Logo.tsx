import React from 'react';
import linkupLogo from '../../assets/images/linkup-logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  vertical?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = false,   // ← default OFF, since your image already contains "LINK UP"
  className = '',
  vertical = false
}) => {
  const iconSizes = {
    sm: 'h-30',   // 40px
    md: 'h-24',   // 56px
    lg: 'h-30'    // 80px
  };

  const textSizes = {
    sm: 'text-base font-extrabold tracking-tight',
    md: 'text-xl font-extrabold tracking-tight',
    lg: 'text-2xl font-black tracking-tight'
  };

  return (
    <div className={`flex ${vertical ? 'flex-col items-center gap-1' : 'items-center gap-2.5'} shrink-0 select-none ${className}`}>
      {/* Logo image (contains both icon and "LINK UP" text) */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center group transition-transform duration-200 hover:scale-105`}>
        <img
          src={linkupLogo}
          alt="LINK UP"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Optional HTML text — OFF by default since the image already has "LINK UP" */}
      {showText && (
        <div className="flex items-center tracking-tight font-display font-extrabold leading-none">
          <span className={`${textSizes[size]} text-[#000000]`}>LINK</span>
          <span className={`${textSizes[size]} text-[#CB0000] ml-1`}>UP</span>
        </div>
      )}
    </div>
  );
};