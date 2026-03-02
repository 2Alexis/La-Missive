import ScrollReveal from '../animations/ScrollReveal';
import TiltCard from '../animations/TiltCard';
import BlurReveal from '../animations/BlurReveal';
import './FeaturesSection.css';

const features = [
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="6" y="6" width="28" height="28" rx="2" />
                <line x1="6" y1="14" x2="34" y2="14" />
                <line x1="12" y1="20" x2="28" y2="20" />
                <line x1="12" y1="26" x2="24" y2="26" />
            </svg>
        ),
        title: 'Curation Exigeante',
        description: 'Un filtre éditorial rigoureux : seuls les sujets qui comptent vraiment arrivent dans votre boîte.',
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="20" cy="20" r="14" />
                <path d="M20 12v8l5 5" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
            </svg>
        ),
        title: 'Lecture de 5 Minutes',
        description: 'Format dense, concis et structuré. Toute l\'essentiel, sans le superflu, en moins de 5 minutes.',
    },
    {
        icon: (
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M8 32 L20 8 L32 32" />
                <line x1="12" y1="24" x2="28" y2="24" />
                <circle cx="20" cy="16" r="3" />
            </svg>
        ),
        title: 'Perspectives Uniques',
        description: 'Des angles d\'analyse originaux, loin des évidences. Pour penser autrement et voir plus loin.',
    },
];

export default function FeaturesSection() {
    return (
        <section className="features section-padding" id="features">
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-title">Ce que vous allez recevoir</h2>
                    <BlurReveal delay={0.2}>
                        <p className="section-subtitle">
                            Chaque édition est pensée comme une page de magazine — soignée, dense, inspirante.
                        </p>
                    </BlurReveal>
                </ScrollReveal>

                <div className="features__grid">
                    {features.map((feature, i) => (
                        <ScrollReveal key={i} delay={i * 0.15}>
                            <TiltCard maxTilt={8} scale={1.03}>
                                <div className="features__card">
                                    <div className="features__icon">{feature.icon}</div>
                                    <h3 className="features__card-title">{feature.title}</h3>
                                    <p className="features__card-desc">{feature.description}</p>
                                </div>
                            </TiltCard>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
