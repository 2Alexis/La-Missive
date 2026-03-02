import ScrollReveal from '../animations/ScrollReveal';
import './SponsorAd.css';

export default function SponsorAd({ variant = 'horizontal', className = '' }) {
    const isHorizontal = variant === 'horizontal';

    return (
        <ScrollReveal className={`sponsor ${isHorizontal ? 'sponsor--horizontal' : 'sponsor--sidebar'} ${className}`}>
            <div className="sponsor-card">
                <span className="sponsor-label">Sponsorisé</span>

                <div className={`sponsor-card__layout ${isHorizontal ? 'sponsor-card__layout--row' : ''}`}>
                    <div className="sponsor-card__img-wrap">
                        <img
                            src={isHorizontal
                                ? 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=250&fit=crop&q=80'
                                : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&q=80'
                            }
                            alt="Partenaire"
                            className="sponsor-card__image"
                            loading="lazy"
                        />
                    </div>
                    <div className="sponsor-card__body">
                        <h3 className="sponsor-card__title">
                            {isHorizontal
                                ? 'Notion — L\'espace de travail tout-en-un'
                                : 'Typewolf — Inspiration typographique'
                            }
                        </h3>
                        <p className="sponsor-card__desc">
                            {isHorizontal
                                ? 'Organisez vos idées, projets et équipes dans un seul outil élégant. Essayé et approuvé par notre rédaction.'
                                : 'Découvrez les meilleures combinaisons typographiques du web, sélectionnées quotidiennement.'
                            }
                        </p>
                        <a href="#" className="sponsor-card__link">
                            {isHorizontal ? 'Essayer gratuitement →' : 'Découvrir →'}
                        </a>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}
