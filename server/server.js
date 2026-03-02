import express from 'express';
import cors from 'cors';
import {
    addSubscriber,
    getAllSubscribers,
    getAllNews,
    getNewsById,
    likeNews,
    getCategories,
    getCommentsByNewsId,
    addComment,
    getAllThreads,
    addThread,
    getRepliesByThreadId,
    addReply,
    getNewsForSitemap
} from './database.js';

const app = express();
const PORT = 3001;

app.use(cors({ origin: /^http:\/\/localhost:\d+$/ }));
app.use(express.json());

// --- Subscribers ---
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email invalide.' });
    }
    try {
        addSubscriber(email);
        res.json({ success: true, message: 'Inscription réussie ! Bienvenue.' });
    } catch (err) {
        if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Cet email est déjà inscrit.' });
        }
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/subscribers', (_req, res) => {
    const subscribers = getAllSubscribers();
    res.json(subscribers);
});

// --- News ---
app.get('/api/news', (req, res) => {
    const { category, sort, search } = req.query;
    const filters = {};
    if (category) filters.category = category;
    if (sort) filters.sort = sort;
    if (search) filters.search = search;
    const news = getAllNews(filters);
    res.json(news);
});

app.get('/api/news/categories', (_req, res) => {
    const categories = getCategories();
    res.json(categories);
});

app.get('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const article = getNewsById(Number(id));
    if (!article) {
        return res.status(404).json({ error: 'Article non trouvé.' });
    }
    res.json(article);
});

app.post('/api/news/:id/like', (req, res) => {
    const { id } = req.params;
    try {
        const result = likeNews(Number(id));
        res.json({ likes_count: result.likes_count });
    } catch {
        res.status(404).json({ error: 'Article non trouvé.' });
    }
});

app.get('/api/news/:id/comments', (req, res) => {
    const { id } = req.params;
    const comments = getCommentsByNewsId(Number(id));
    res.json(comments);
});

app.post('/api/news/:id/comments', (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Auteur et contenu requis.' });
    }
    try {
        addComment(Number(id), author, content);
        const comments = getCommentsByNewsId(Number(id));
        res.json(comments);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// --- Community Threads ---
app.get('/api/community/threads', (_req, res) => {
    const threads = getAllThreads();
    res.json(threads);
});

app.post('/api/community/threads', (req, res) => {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
        return res.status(400).json({ error: 'Titre, auteur et contenu requis.' });
    }
    try {
        addThread(title, author, content);
        const threads = getAllThreads();
        res.json(threads);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/community/threads/:id/replies', (req, res) => {
    const { id } = req.params;
    const replies = getRepliesByThreadId(Number(id));
    res.json(replies);
});

app.post('/api/community/threads/:id/replies', (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Auteur et contenu requis.' });
    }
    try {
        addReply(Number(id), author, content);
        const replies = getRepliesByThreadId(Number(id));
        res.json(replies);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// ============================================================
// URL du site — À MODIFIER avec votre vrai domaine en production
// ============================================================
const SITE_URL = 'https://lamissive.com';

// --- Sitemap dynamique ---
app.get('/sitemap.xml', (_req, res) => {
    const today = new Date().toISOString().split('T')[0];

    // Pages statiques du site
    const staticPages = [
        { loc: '/', changefreq: 'weekly', priority: '1.0' },
        { loc: '/actualites', changefreq: 'daily', priority: '0.8' },
    ];

    // ──────────────────────────────────────────────────────────
    // 🔌 BRANCHEMENT BASE DE DONNÉES
    // La fonction getNewsForSitemap() retourne tous les articles
    // depuis la table `news` (id + created_at).
    // Si tu changes de source de données (CMS, API externe…),
    // remplace simplement cet appel par ta propre fonction.
    // ──────────────────────────────────────────────────────────
    const articles = getNewsForSitemap();

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Génération des pages statiques
    for (const page of staticPages) {
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
    }

    // Génération dynamique des pages articles
    for (const article of articles) {
        const lastmod = article.created_at
            ? article.created_at.split('T')[0].split(' ')[0]
            : today;
        xml += '  <url>\n';
        xml += `    <loc>${SITE_URL}/actualites/${article.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
    }

    xml += '</urlset>';

    res.set('Content-Type', 'application/xml');
    res.send(xml);
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur newsletter démarré sur http://localhost:${PORT}`);
});
