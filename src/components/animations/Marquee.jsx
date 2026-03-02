import './Marquee.css';

export default function Marquee({ children, speed = 30, className = '' }) {
    return (
        <div className={`marquee ${className}`}>
            <div className="marquee__track" style={{ animationDuration: `${speed}s` }}>
                <div className="marquee__content">{children}</div>
                <div className="marquee__content" aria-hidden="true">{children}</div>
            </div>
        </div>
    );
}
