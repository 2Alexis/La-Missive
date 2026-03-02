import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlurReveal from '../components/animations/BlurReveal';
import ScrollReveal from '../components/animations/ScrollReveal';
import './AllNewsPage.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function AllNewsPage() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortOrder, setSortOrder] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/news/categories`)
            .then(res => res.json())
            .then(setCategories)
            .catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeCategory !== 'all') params.set('category', activeCategory);
        if (sortOrder) params.set('sort', sortOrder);
        if (searchQuery.trim()) params.set('search', searchQuery.trim());

        fetch(`${API_URL}/api/news?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activeCategory, sortOrder, searchQuery]);

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

    return (
        <div className="all-news-page">
            <header className="all-news-page__header">
                <div className="container">
                    <Link to="/" className="all-news-page__back" id="back-home">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Retour à l'accueil
                    </Link>
                    <BlurReveal>
                        <h1 className="all-news-page__title">Toutes les Actualités</h1>
                    </BlurReveal>
                    <p className="all-news-page__count">
                        {news.length} article{news.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </header>

            <div className="container">
                <div className="all-news-page__filters">
                    <div className="all-news-page__categories">
                        <button
                            className={`all-news-page__chip ${activeCategory === 'all' ? 'all-news-page__chip--active' : ''}`}
                            onClick={() => setActiveCategory('all')}
                        >
                            Tout
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`all-news-page__chip ${activeCategory === cat ? 'all-news-page__chip--active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {categoryLabels[cat] || cat}
                            </button>
                        ))}
                    </div>

                    <div className="all-news-page__controls">
                        <div className="all-news-page__search">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                id="search-news"
                            />
                        </div>
                        <select
                            className="all-news-page__sort"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            id="sort-news"
                        >
                            <option value="recent">Plus récent</option>
                            <option value="oldest">Plus ancien</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="all-news-page__loading">
                        <div className="all-news-page__spinner" />
                    </div>
                ) : news.length === 0 ? (
                    <div className="all-news-page__empty">
                        <p>Aucun article trouvé pour ces critères.</p>
                    </div>
                ) : (
                    <div className="all-news-page__grid">
                        {news.map((article, i) => (
                            <ScrollReveal key={article.id} delay={i * 0.08}>
                                <Link to={`/actualites/${article.id}`} className="all-news-page__card" id={`news-card-${article.id}`}>
                                    <div className="all-news-page__card-img">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            loading="lazy"
                                        />
                                        <span className="all-news-page__card-category">
                                            {categoryLabels[article.category] || article.category}
                                        </span>
                                    </div>
                                    <div className="all-news-page__card-body">
                                        <span className="all-news-page__card-date">{formatDate(article.created_at)}</span>
                                        <h3 className="all-news-page__card-title">{article.title}</h3>
                                        <p className="all-news-page__card-excerpt">{article.excerpt}</p>
                                        <div className="all-news-page__card-meta">
                                            <span className="all-news-page__card-likes">
                                                ♥ {article.likes_count}
                                            </span>
                                            <span className="all-news-page__card-read">Lire →</span>
                                        </div>
                                    </div>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
