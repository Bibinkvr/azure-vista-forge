import { useEffect, useRef, useState } from "react";
import airplaneImage from "@/assets/airplane-trail.png";

const TrackableAirplane = () => {
  const airplaneRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={airplaneRef}
      className={`hidden md:block fixed pointer-events-none z-50 transition-all duration-300 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transform: `translate3d(${mousePosition.x - 40}px, ${mousePosition.y - 40}px, 0)`,
        filter: `drop-shadow(0 0 20px hsl(var(--primary) / 0.4))`
      }}
    >
      <div className="relative">
        {/* Airplane Image */}
        <img 
          src={airplaneImage}
          alt="Airplane"
          className="w-20 h-20 object-contain animate-float"
        />

        {/* Dotted trail effect */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1 opacity-60">
          <div className="w-1 h-1 rounded-full bg-primary animate-ping"></div>
          <div className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 rounded-full bg-primary animate-ping" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* Floating text */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-semibold text-primary bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-elegant border border-primary/20">
          Your Future Beyond Borders
        </span>
      </div>
    </div>
  );
};

export default TrackableAirplane;