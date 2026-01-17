interface BrainIconProps {
  className?: string;
  size?: number;
}

const BrainIcon = ({ className = '', size = 80 }: BrainIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Brain base with hand */}
      <g>
        {/* Hand cradle */}
        <path
          d="M16 52C16 52 12 48 12 44C12 40 16 38 20 38C22 38 24 39 26 40"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M64 52C64 52 68 48 68 44C68 40 64 38 60 38C58 38 56 39 54 40"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Brain left hemisphere */}
        <ellipse
          cx="32"
          cy="32"
          rx="14"
          ry="16"
          fill="hsl(207, 40%, 85%)"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2.5"
        />
        
        {/* Brain right hemisphere */}
        <ellipse
          cx="48"
          cy="32"
          rx="14"
          ry="16"
          fill="hsl(207, 40%, 85%)"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2.5"
        />
        
        {/* Brain folds left */}
        <path
          d="M26 26C28 24 30 26 32 24"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 34C27 32 29 35 32 33"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Brain folds right */}
        <path
          d="M48 24C50 26 52 24 54 26"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M48 33C51 35 53 32 56 34"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Center connection */}
        <line
          x1="40"
          y1="20"
          x2="40"
          y2="44"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="2"
        />
        
        {/* Hand base */}
        <path
          d="M20 50C20 50 28 56 40 56C52 56 60 50 60 50"
          stroke="hsl(207, 90%, 45%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Sparkles */}
        <g fill="hsl(207, 90%, 45%)">
          <path d="M58 14L60 18L64 16L60 18L62 22L60 18L56 20L60 18L58 14Z" />
          <circle cx="66" cy="12" r="1.5" />
        </g>
      </g>
    </svg>
  );
};

export default BrainIcon;
