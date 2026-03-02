import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../animations/ScrollReveal';
import BlurReveal from '../animations/BlurReveal';
import MagneticButton from '../animations/MagneticButton';
import './NewsSection.css';

const API_URL = 'http://localhost:3001';

export default function NewsSection() {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/news`)
            .then(res => res.json())
            .then(data => setNews(data.slice(0, 3)))
            .catch(() => { });
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const categoryLabels = {
        digital: 'Digital',
        tendances: 'Tendances',
        culture: 'Culture',
        creativite: 'Créativité',
    };

    if (news.length === 0) return null;

    return (
        <section className="news section-padding" id="news">
            <div className="container">
                <ScrollReveal>
                    <h2 className="section-title">Dernières Actualités</h2>
                    <BlurReveal delay={0.2}>
                        <p className="section-subtitle">
                            Réagissez, commentez, partagez — la newsletter vit aussi grâce à vous.
                        </p>
                    </BlurReveal>
                </ScrollReveal>

                <div className="news__grid">
                    {news.map((article, i) => (
                        <ScrollReveal key={article.id} delay={i * 0.1}>
                            <Link to={`/actualites/${article.id}`} className="news__card-link" id={`news-link-${article.id}`}>
                                <article className="news__card">
                                    <div className="news__card-img">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            loading="lazy"
                                        />
                                        <span className="news__card-category">
                                            {categoryLabels[article.category] || article.category}
                                        </span>
                                    </div>
                                    <div className="news__card-body">
                                        <span className="news__card-date">{formatDate(article.created_at)}</span>
                                        <h3 className="news__card-title">{article.title}</h3>
                                        <p className="news__card-excerpt">{article.excerpt}</p>
                                        <div className="news__card-actions">
                                            <span className="news__card-likes">
                                                ♥ {article.likes_count}
                                            </span>
                                            <span className="news__card-read">Lire l'article →</span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>

                <ScrollReveal delay={0.3}>
                    <div className="news__see-all">
                        <MagneticButton>
                            <Link to="/actualites" className="cta-button" id="see-all-news">
                                <span>Voir toutes les actualités</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </MagneticButton>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
