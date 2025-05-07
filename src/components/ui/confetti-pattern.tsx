"use client";
import type React from 'react';

const ConfettiPattern: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props}  xmlns="http://www.w3.org/2000/svg" >
    <defs>
      <pattern id="confettiPattern" patternUnits="userSpaceOnUse" width="150" height="150" patternTransform="rotate(25)">
        <circle cx="15" cy="15" r="1.5" fill="hsl(var(--primary-foreground) / 0.5)" />
        <rect x="30" y="45" width="3" height="5" fill="hsl(var(--accent) / 0.4)" transform="rotate(45 31.5 47.5)"/>
        <circle cx="75" cy="75" r="1" fill="hsl(var(--primary-foreground) / 0.4)" />
        <rect x="105" y="22" width="2.5" height="4" fill="hsl(var(--accent) / 0.3)" transform="rotate(-30 106.25 24)"/>
        <circle cx="45" cy="120" r="1.5" fill="hsl(var(--primary-foreground) / 0.3)" />
        <rect x="120" y="105" width="3.5" height="2" fill="hsl(var(--accent) / 0.5)" transform="rotate(15 121.75 106)"/>
        
        {/* More subtle elements */}
        <circle cx="50" cy="20" r="0.8" fill="hsl(var(--primary-foreground) / 0.2)" />
        <circle cx="100" cy="60" r="1.2" fill="hsl(var(--accent) / 0.25)" />
        <circle cx="20" cy="90" r="1" fill="hsl(var(--primary-foreground) / 0.25)" />
        <circle cx="130" cy="130" r="0.9" fill="hsl(var(--accent) / 0.2)" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#confettiPattern)"/>
  </svg>
);

export default ConfettiPattern;
