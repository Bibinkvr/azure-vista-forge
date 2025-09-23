import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";

const TrackableAirplane = () => {
  const airplaneRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('home')?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Smooth movement with some offset
        setMousePosition({
          x: x * 0.8,
          y: y * 0.8
        });
      }
    };

    const homeSection = document.getElementById('home');
    if (homeSection) {
      homeSection.addEventListener('mousemove', handleMouseMove);
      return () => homeSection.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div 
      ref={airplaneRef}
      className="fixed pointer-events-none z-10 transition-all duration-500 ease-out"
      style={{
        transform: `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale(${isHovered ? 1.2 : 1})`,
        filter: `drop-shadow(0 0 20px hsl(var(--primary) / 0.6))`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Airplane SVG */}
        <svg 
          width="60" 
          height="60" 
          viewBox="0 0 60 60" 
          className="text-primary animate-pulse"
          style={{ 
            filter: 'drop-shadow(0 0 10px currentColor)',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          {/* Airplane body */}
          <path
            d="M30 5 L35 15 L45 20 L35 25 L30 55 L25 25 L15 20 L25 15 Z"
            fill="currentColor"
            stroke="hsl(var(--primary) / 0.8)"
            strokeWidth="2"
          />
          {/* Wings */}
          <path
            d="M15 20 L45 20 L40 25 L20 25 Z"
            fill="hsl(var(--accent))"
            opacity="0.8"
          />
          {/* Trail particles */}
          <circle cx="30" cy="50" r="2" fill="hsl(var(--primary) / 0.6)" className="animate-ping" />
          <circle cx="28" cy="52" r="1.5" fill="hsl(var(--accent) / 0.5)" className="animate-ping" style={{ animationDelay: '0.2s' }} />
          <circle cx="32" cy="52" r="1.5" fill="hsl(var(--accent) / 0.5)" className="animate-ping" style={{ animationDelay: '0.4s' }} />
        </svg>

        {/* Glowing trail effect */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-primary to-transparent opacity-60 animate-pulse"></div>
      </div>

      {/* Floating text */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-semibold text-primary bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
          Your Future Beyond Borders
        </span>
      </div>
    </div>
  );
};

export default TrackableAirplane;