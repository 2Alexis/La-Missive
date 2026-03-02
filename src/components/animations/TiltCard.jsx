import { useRef, useCallback, useState } from 'react';

export default function TiltCard({
    children,
    className = '',
    maxTilt = 8,
    glareEnabled = true,
    scale = 1.02,
}) {
    const cardRef = useRef(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

    const handleMouseMove = useCallback((e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        setTilt({
            rotateX: (0.5 - y) * maxTilt * 2,
            rotateY: (x - 0.5) * maxTilt * 2,
        });

        if (glareEnabled) {
            setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
        }
    }, [maxTilt, glareEnabled]);

    const handleMouseLeave = useCallback(() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setGlare({ x: 50, y: 50, opacity: 0 });
    }, []);

    return (
        <div
            ref={cardRef}
            className={`tilt-card ${className}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}
        >
            <div
                className="tilt-card__inner"
                style={{
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.rotateX !== 0 || tilt.rotateY !== 0 ? scale : 1})`,
                    transition: 'transform 0.3s ease-out',
                    transformStyle: 'preserve-3d',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {children}
                {glareEnabled && (
                    <div
                        className="tilt-card__glare"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
                            transition: 'background 0.3s ease-out',
                        }}
                    />
                )}
            </div>
        </div>
    );
}
