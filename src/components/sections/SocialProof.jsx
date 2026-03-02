import Marquee from '../animations/Marquee';
import CountUp from '../animations/CountUp';
import './SocialProof.css';

export default function SocialProof() {
    const items = [
        { type: 'countup', prefix: '+', end: 10000, suffix: ' esprits curieux', label: 'Rejoint par ' },
        { type: 'text', text: '★★★★★ 4.9/5 sur Trustpilot' },
        { type: 'countup', prefix: '', end: 68, suffix: '% d\'ouverture', label: 'Taux de ' },
        { type: 'text', text: 'La newsletter #1 dans sa catégorie' },
        { type: 'text', text: 'Cité par Le Monde, Les Échos, Maddyness' },
        { type: 'text', text: '★★★★★ 4.9/5 sur Trustpilot' },
    ];

    return (
        <section className="social-proof">
            <Marquee speed={35}>
                {items.map((item, i) => (
                    <span key={i} className="social-proof__item">
                        <span className="social-proof__dot">•</span>
                        {item.type === 'countup' ? (
                            <>
                                {item.label}
                                <CountUp
                                    end={item.end}
                                    prefix={item.prefix}
                                    suffix={item.suffix}
                                    separator=" "
                                    duration={2.5}
                                />
                            </>
                        ) : (
                            item.text
                        )}
                    </span>
                ))}
            </Marquee>
        </section>
    );
}
