import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlurReveal from '../components/animations/BlurReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import './ArticlePage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function ArticlePage() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentForm, setCommentForm] = useState({ author: '', content: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        fetch(`${API_URL}/api/news/${id}`)
            .then(res => res.json())
            .then(data => {
                setArticle(data);
                setLoading(false);
                // Fetch related news from same category
                return fetch(`${API_URL}/api/news?category=${data.category}`);
            })
            .then(res => res.json())
            .then(data => {
                setRelatedNews(data.filter(n => n.id !== Number(id)).slice(0, 3));
            })
            .catch(() => setLoading(false));

        fetch(`${API_URL}/api/news/${id}/comments`)
            .then(res => res.json())
            .then(setComments)
            .catch(() => { });
    }, [id]);

    const handleLike = async () => {
        try {
            const res = await fetch(`${API_URL}/api/news/${id}/like`, { method: 'POST' });
            const data = await res.json();
            setArticle(prev => ({ ...prev, likes_count: data.likes_count }));
        } catch { }
    };

    const submitComment = async (e) => {
        e.preventDefault();
        if (!commentForm.author || !commentForm.content) return;
        try {
            const res = await fetch(`${API_URL}/api/news/${id}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(commentForm),
            });
            const data = await res.json();
            setComments(data);
            setCommentForm({ author: '', content: '' });
        } catch { }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    const estimateReadTime = (content) => {
        if (!content) return '3 min';
        const words = content.split(/\s+/).length;
        return `${Math.max(1, Math.round(words / 200))} min`;
    };

    const categoryLabels = {
        digital: 'Digital',
        tendances: 'Tendances',
        culture: 'Culture',
        creativite: 'Créativité',
    };

    const renderContent = (content) => {
        if (!content) return null;
        return content.split('\n\n').map((block, i) => {
            if (block.startsWith('## ')) {
                return <h2 key={i} className="article-page__content-h2">{block.replace('## ', '')}</h2>;
            }
            if (block.startsWith('**') && block.includes('—')) {
                const parts = block.split('—');
                const title = parts[0].replace(/\*\*/g, '').trim();
                const text = parts.slice(1).join('—').trim();
                return (
                    <p key={i} className="article-page__content-point">
                        <strong>{title}</strong> — {text}
                    </p>
                );
            }
            if (block.startsWith('- ')) {
                const items = block.split('\n').filter(l => l.startsWith('- '));
                return (
                    <ul key={i} className="article-page__content-list">
                        {items.map((item, j) => {
                            const text = item.replace('- ', '');
                            return <li key={j} dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                        })}
                    </ul>
                );
            }
            return <p key={i}>{block}</p>;
        });
    };

    if (loading) {
        return (
            <div className="article-page article-page--loading">
                <div className="all-news-page__spinner" />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="article-page article-page--error">
                <h2>Article non trouvé</h2>
                <Link to="/actualites" className="cta-button">
                    <span>Voir les actualités</span>
                </Link>
            </div>
        );
    }

    return (
        <article className="article-page">
            {/* Hero */}
            <header className="article-page__hero">
                <img
                    src={article.image}
                    alt={article.title}
                    className="article-page__hero-img"
                />
                <div className="article-page__hero-overlay">
                    <div className="container">
                        <Link to="/actualites" className="article-page__back" id="back-to-news">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Retour aux actualités
                        </Link>
                        <BlurReveal delay={0.2}>
                            <span className="article-page__category">
                                {categoryLabels[article.category] || article.category}
                            </span>
                        </BlurReveal>
                        <BlurReveal delay={0.3}>
                            <h1 className="article-page__title">{article.title}</h1>
                        </BlurReveal>
                        <BlurReveal delay={0.5}>
                            <div className="article-page__meta">
                                <span>{formatDate(article.created_at)}</span>
                                <span className="article-page__meta-dot">•</span>
                                <span>{estimateReadTime(article.content)} de lecture</span>
                                <span className="article-page__meta-dot">•</span>
                                <span>♥ {article.likes_count} likes</span>
                            </div>
                        </BlurReveal>
                    </div>
                </div>
            </header>

            {/* Article Body */}
            <div className="article-page__body">
                <div className="container">
                    <div className="article-page__layout">
                        <div className="article-page__content">
                            <ScrollReveal>
                                <p className="article-page__lead">{article.excerpt}</p>
                            </ScrollReveal>
                            <ScrollReveal delay={0.1}>
                                <div className="article-page__text">
                                    {renderContent(article.content)}
                                </div>
                            </ScrollReveal>

                            {/* Like section */}
                            <div className="article-page__like-section">
                                <button
                                    className="article-page__like-btn"
                                    onClick={handleLike}
                                    id="article-like-btn"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill={article.likes_count > 0 ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
                                    <span>J'aime · {article.likes_count}</span>
                                </button>
                            </div>

                            {/* Comments Section */}
                            <div className="article-page__comments">
                                <h3 className="article-page__comments-title">
                                    Commentaires ({comments.length})
                                </h3>

                                <form className="article-page__comment-form" onSubmit={submitComment}>
                                    <input
                                        className="form-input"
                                        type="text"
                                        placeholder="Votre nom"
                                        value={commentForm.author}
                                        onChange={(e) => setCommentForm(prev => ({ ...prev, author: e.target.value }))}
                                        required
                                        id="comment-author"
                                    />
                                    <textarea
                                        className="form-input form-textarea"
                                        placeholder="Partagez votre avis..."
                                        value={commentForm.content}
                                        onChange={(e) => setCommentForm(prev => ({ ...prev, content: e.target.value }))}
                                        required
                                        id="comment-content"
                                    />
                                    <button type="submit" className="form-button" id="submit-comment">
                                        Publier
                                    </button>
                                </form>

                                <div className="article-page__comments-list">
                                    {comments.length === 0 && (
                                        <p className="article-page__comments-empty">
                                            Aucun commentaire. Soyez le premier à réagir !
                                        </p>
                                    )}
                                    {comments.map(c => (
                                        <div key={c.id} className="article-page__comment">
                                            <div className="article-page__comment-header">
                                                <strong>{c.author}</strong>
                                                <span>{formatDate(c.created_at)}</span>
                                            </div>
                                            <p>{c.content}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="article-page__sidebar">
                            {relatedNews.length > 0 && (
                                <div className="article-page__related">
                                    <h3 className="article-page__related-title">Lire aussi</h3>
                                    {relatedNews.map(item => (
                                        <Link
                                            key={item.id}
                                            to={`/actualites/${item.id}`}
                                            className="article-page__related-card"
                                            id={`related-${item.id}`}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="article-page__related-img"
                                            />
                                            <div>
                                                <span className="article-page__related-date">
                                                    {formatDate(item.created_at)}
                                                </span>
                                                <h4 className="article-page__related-name">{item.title}</h4>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Sponsor Ad */}
                            <a
                                href="https://www.notion.so"
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                className="sponsor-card article-page__sponsor"
                                id="article-sponsor"
                            >
                                <span className="sponsor-label">Sponsorisé</span>
                                <img
                                    src="https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=340&fit=crop&q=80"
                                    alt="Notion — Votre espace de travail tout-en-un"
                                    className="sponsor-card__image"
                                />
                                <h4 className="sponsor-card__title">Notion — Tout-en-un pour vos projets</h4>
                                <p className="sponsor-card__desc">
                                    Organisez vos notes, projets et documents dans un seul outil. Essai gratuit pour les créateurs.
                                </p>
                                <span className="sponsor-card__link">Découvrir Notion →</span>
                            </a>

                            <div className="article-page__newsletter-cta">
                                <h3>Ne ratez rien</h3>
                                <p>Recevez nos meilleurs articles chaque semaine, directement dans votre boîte mail.</p>
                                <Link to="/#hero" className="cta-button">
                                    <span>S'inscrire</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </article>
    );
}
