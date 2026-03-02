import { useState } from 'react';
import SplitText from '../animations/SplitText';
import ScrollReveal from '../animations/ScrollReveal';
import MagneticButton from '../animations/MagneticButton';
import './HeroSection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function HeroSection() {
    const [email, setEmail] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFeedback({ type: '', message: '' });

        try {
            const res = await fetch(`${API_URL}/api/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setFeedback({ type: 'success', message: data.message });
                setEmail('');
            } else {
                setFeedback({ type: 'error', message: data.error });
            }
        } catch {
            setFeedback({ type: 'error', message: 'Connexion impossible. Réessayez.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="hero" id="hero">
            <div className="container hero__grid">
                <div className="hero__content">
                    <div className="hero__overline">
                        <ScrollReveal delay={0.1}>
                            <span className="hero__badge">Newsletter Premium</span>
                        </ScrollReveal>
                    </div>
                    <h1 className="hero__title">
                        <SplitText text="Des idées qui méritent votre attention." delay={0.3} />
                    </h1>
                    <ScrollReveal delay={0.8}>
                        <p className="hero__subtitle">
                            Chaque semaine, une sélection exigeante d'analyses, de tendances et d'inspirations
                            — livrée directement dans votre boîte mail.
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={1.0}>
                        <form className="email-group" onSubmit={handleSubmit}>
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                id="hero-email"
                            />
                            <MagneticButton>
                                <button className="cta-button" type="submit" disabled={loading} id="hero-subscribe">
                                    <span>{loading ? 'Envoi...' : "S'inscrire"}</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </MagneticButton>
                        </form>
                        {feedback.message && (
                            <p className={`feedback feedback--${feedback.type}`}>{feedback.message}</p>
                        )}
                    </ScrollReveal>
                    <ScrollReveal delay={1.2}>
                        <p className="hero__note">Gratuit · Sans spam · Désinscription en un clic</p>
                    </ScrollReveal>
                </div>
                <div className="hero__visual">
                    <ScrollReveal delay={0.5} direction="right">
                        <div className="hero__shape">
                            <div className="hero__shape-inner">
                                <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#FF5E00" stopOpacity="0.9" />
                                            <stop offset="50%" stopColor="#0A1128" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#D5DDD5" stopOpacity="0.6" />
                                        </linearGradient>
                                    </defs>
                                    <circle cx="200" cy="200" r="180" fill="none" stroke="url(#heroGrad)" strokeWidth="2" />
                                    <circle cx="200" cy="200" r="140" fill="none" stroke="var(--color-ink)" strokeWidth="1" opacity="0.3" />
                                    <circle cx="200" cy="200" r="100" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" opacity="0.5" />
                                    <line x1="0" y1="200" x2="400" y2="200" stroke="var(--color-ink)" strokeWidth="0.5" opacity="0.15" />
                                    <line x1="200" y1="0" x2="200" y2="400" stroke="var(--color-ink)" strokeWidth="0.5" opacity="0.15" />
                                    <circle cx="200" cy="60" r="8" fill="var(--color-accent)" />
                                    <circle cx="340" cy="200" r="6" fill="var(--color-ink)" opacity="0.4" />
                                    <circle cx="120" cy="320" r="10" fill="var(--color-sage)" />
                                    <text x="200" y="195" textAnchor="middle" fontFamily="var(--font-serif)" fontSize="32" fontWeight="700" fill="var(--color-ink)">LM</text>
                                    <text x="200" y="220" textAnchor="middle" fontFamily="var(--font-sans)" fontSize="10" letterSpacing="4" fill="var(--color-gray)" textTransform="uppercase">LA MISSIVE</text>
                                </svg>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
