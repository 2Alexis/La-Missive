import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 0.7,
    distance = 40,
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-60px' });

    const directions = {
        up: { y: distance, x: 0 },
        down: { y: -distance, x: 0 },
        left: { x: distance, y: 0 },
        right: { x: -distance, y: 0 },
    };

    const initial = {
        opacity: 0,
        ...directions[direction],
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={initial}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : initial}
            transition={{
                duration,
                delay,
                ease: [0.16, 1, 0.3, 1],
            }}
        >
            {children}
        </motion.div>
    );
}
