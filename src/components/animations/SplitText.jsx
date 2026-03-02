import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SplitText({ text, className = '', delay = 0 }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const words = containerRef.current?.querySelectorAll('.split-word');
        if (!words) return;

        gsap.fromTo(
            words,
            { y: 80, opacity: 0, rotateX: -40 },
            {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.06,
                delay,
                ease: 'power3.out',
            }
        );
    }, [delay]);

    const words = text.split(' ');

    return (
        <span ref={containerRef} className={className} style={{ display: 'inline' }}>
            {words.map((word, i) => (
                <span
                    key={i}
                    style={{
                        display: 'inline-block',
                        overflow: 'hidden',
                        verticalAlign: 'top',
                        perspective: '600px',
                    }}
                >
                    <span
                        className="split-word"
                        style={{
                            display: 'inline-block',
                            opacity: 0,
                            willChange: 'transform, opacity',
                        }}
                    >
                        {word}
                    </span>
                    {i < words.length - 1 && <span>&nbsp;</span>}
                </span>
            ))}
        </span>
    );
}
