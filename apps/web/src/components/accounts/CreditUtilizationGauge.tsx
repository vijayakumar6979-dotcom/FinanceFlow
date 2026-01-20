import React from 'react';
import { motion } from 'framer-motion';

interface CreditUtilizationGaugeProps {
    utilization: number;
    size?: number;
}

export function CreditUtilizationGauge({ utilization, size = 200 }: CreditUtilizationGaugeProps) {
    const value = Math.min(Math.max(utilization, 0), 100);
    const radius = 80;
    const strokeWidth = 12;
    const center = size / 2;

    // Needle Angle: 180 (Left) -> 270 (Top) -> 360 (Right)
    const needleAngle = 180 + (value / 100) * 180;

    // Helper to create arc paths
    // We want arcs to go from Left to Right via Top.
    // SVG Coord: (0,0) top-left.
    // Center: (100, 100). Radius: 80.
    // Left Point: (20, 100). Right Point: (180, 100). Top Point: (100, 20).
    // Angles in radians for cos/sin: 
    // Left: PI (180deg). Top: 1.5PI (270deg) ? No, standard trig: 0 is Right, PI is Left, 3PI/2 (270) is Down, PI/2 (90) is Up?
    // SVG Y is flipped. 
    // 0 = Right. PI/2 = Down. PI = Left. 3PI/2 = Up.
    // So Left=PI. Right=0 (or 2PI). Up=3PI/2.
    // We want range: Left(PI) -> Up(3PI/2) -> Right(2PI).
    // Correct order for clockwise drawing? 
    // Wait, let's just use `describeArc` with standard math.

    const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
        // SVG: 0 deg is 3 o'clock. Clockwise positive.
        // We want: 
        // 180 deg (Left) -> Start
        // 270 deg (Top)
        // 360 deg (Right) -> End.
        // But SVG arc flag sweep=0 goes counter-clockwise.
        // Let's just calculate points manually for the 3 segments.

        // Convert to standard radian (0=Right, clockwise)
        const rad = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: centerX + (radius * Math.cos(rad)),
            y: centerY + (radius * Math.sin(rad))
        };
    };

    // Arc function. 
    // We draw clockwise from startAngle to endAngle? 
    // Let's define: 180->240 (Good/Green), 240->300 (Fair/Yellow), 300->360 (Bad/Red).
    // Left(180) -> Top-Left(225) ?? 
    // 180 is Left. 270 is Top (-90). 
    // So range is 180 -> 360 (going 180->270->360). 
    // Wait, 180->270 is clockwise in standard math? No, counter-clockwise?
    // SVG Y-down: 
    // 180 -> 270 (x decr, y decr?) No.
    // cos(180)=-1, sin(180)=0 -> (-1,0) Left.
    // cos(270)=0, sin(270)=-1 -> (0,-1) Up.
    // So 180->270 is clockwise in SVG.
    // So segments:
    // 0-33%: 180 -> 240
    // 33-66%: 240 -> 300
    // 66-100%: 300 -> 360

    // ADJUSTMENT: 0% is Good (Green). 100% is Bad (Red).
    // So First Segment (Left) is Green.
    // 180 -> 240: Green.
    // 240 -> 300: Yellow.
    // 300 -> 360: Red.

    const createArc = (startDeg: number, endDeg: number) => {
        const start = polarToCartesian(center, center, radius, endDeg); // Draw backwards?
        const end = polarToCartesian(center, center, radius, startDeg);
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        // Standard clockwise:
        // M startX startY A r r 0 0 1 endX endY
        const s = polarToCartesian(center, center, radius, startDeg);
        const e = polarToCartesian(center, center, radius, endDeg);
        const largeArc = endDeg - startDeg <= 180 ? "0" : "1";
        return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
    };

    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            <svg width={size} height={size / 1.5} viewBox={`0 0 ${size} ${size / 1.5}`} className="overflow-visible">
                <defs>
                    <filter id="glow-gauge-green" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Track */}
                <path d={createArc(180, 360)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} strokeLinecap="round" />

                {/* Green Segment (0 - 35%) */}
                <path
                    d={createArc(180, 180 + (0.35 * 180))}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={strokeWidth}
                    filter="url(#glow-gauge-green)"
                />

                {/* Yellow Segment (35% - 70%) */}
                <path
                    d={createArc(180 + (0.35 * 180), 180 + (0.70 * 180))}
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth={strokeWidth}
                />

                {/* Red Segment (70% - 100%) */}
                <path
                    d={createArc(180 + (0.70 * 180), 360)}
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth={strokeWidth}
                />

                {/* Labels */}
                <text x="20" y={center + 20} fill="#10B981" fontSize="11" fontWeight="bold">Excellent</text>
                <text x={size - 20} y={center + 20} fill="#EF4444" fontSize="11" fontWeight="bold" textAnchor="end">Pooling</text>

                {/* Needle */}
                <motion.g
                    initial={{ rotate: 180 }}
                    animate={{ rotate: needleAngle }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    style={{ originX: "50%", originY: `${center}px` }} // Rotate around SVG center
                >
                    {/* Draw needle pointing Right (0 deg) initially, then rotated */}
                    <path
                        d={`M ${center} ${center - 4} L ${center + radius - 5} ${center} L ${center} ${center + 4} Z`}
                        fill="#fff"
                        filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.5))"
                    />
                    <circle cx={center} cy={center} r="6" fill="#fff" />
                </motion.g>
            </svg>

            <div className="absolute bottom-6 flex flex-col items-center">
                <span className="text-3xl font-black text-white">{value.toFixed(0)}%</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${value < 35 ? 'text-emerald-400' : value < 70 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                    {value < 35 ? 'Excellent' : value < 70 ? 'Fair' : 'High Usage'}
                </span>
            </div>
        </div>
    );
}
