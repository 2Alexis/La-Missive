import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

export default function CountUp({
    end,
    duration = 2,
    prefix = '',
    suffix = '',
    className = '',
    separator = ' ',
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-40px' });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        let animationFrame;

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);
            const easedProgress = easeOutQuart(progress);

            setCount(Math.round(easedProgress * end));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, end, duration]);

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    };

    return (
        <span ref={ref} className={`count-up ${className}`}>
            {prefix}{formatNumber(count)}{suffix}
        </span>
    );
}
