import { useState } from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import './Footer.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function Footer() {
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
            setFeedback({ type: 'error', message: 'Connexion impossible.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="footer" id="footer">
            <div className="container">
                <ScrollReveal>
                    <div className="footer__grid">
                        <div className="footer__brand">
                            <div className="footer__logo">LM</div>
                            <p className="footer__tagline">La Missive — Des idées qui méritent votre attention.</p>
                        </div>

                        <div className="footer__subscribe">
                            <h3 className="footer__title">Rejoignez-nous</h3>
                            <form className="email-group email-group--footer" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    id="footer-email"
                                />
                                <button className="cta-button" type="submit" disabled={loading} id="footer-subscribe">
                                    <span>{loading ? '...' : "S'inscrire"}</span>
                                </button>
                            </form>
                            {feedback.message && (
                                <p className={`feedback feedback--${feedback.type}`}>{feedback.message}</p>
                            )}
                        </div>

                        <div className="footer__links">
                            <h3 className="footer__title">Navigation</h3>
                            <nav>
                                <a href="#hero">Accueil</a>
                                <a href="#features">Contenu</a>
                                <a href="#news">Actualités</a>
                                <a href="#community">Communauté</a>
                            </nav>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="footer__bottom">
                    <p>© 2026 La Missive. Tous droits réservés.</p>
                    <div className="footer__socials">
                        <a href="#" aria-label="Twitter">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Instagram">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <circle cx="12" cy="12" r="5" />
                                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                            </svg>
                        </a>
                        <a href="#" aria-label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
