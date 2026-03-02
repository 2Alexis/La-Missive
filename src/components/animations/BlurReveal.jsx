import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function BlurReveal({
    children,
    className = '',
    delay = 0,
    duration = 0.8,
    once = true,
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once, margin: '-40px' });

    return (
        <motion.div
            ref={ref}
            className={`blur-reveal ${className}`}
            initial={{ filter: 'blur(12px)', opacity: 0, y: 10 }}
            animate={isInView
                ? { filter: 'blur(0px)', opacity: 1, y: 0 }
                : { filter: 'blur(12px)', opacity: 0, y: 10 }
            }
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
