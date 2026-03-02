import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
import { sendWelcomeEmail } from './email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// URL du site — À MODIFIER avec votre vrai domaine en production
// ============================================================
const SITE_URL = process.env.SITE_URL || 'https://lamissive.vercel.app';

// CORS : accepte le frontend local ET le domaine de production
app.use(cors({
    origin: [
        /^http:\/\/localhost:\d+$/,
        'https://lamissive.vercel.app',
        'https://la-missive.vercel.app',
        /\.vercel\.app$/
    ]
}));
app.use(express.json());

// --- Subscribers ---
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Email invalide.' });
    }
    try {
        await addSubscriber(email);
        res.json({ success: true, message: 'Inscription réussie ! Bienvenue.' });
        // Envoi de l'email de bienvenue (non-bloquant)
        sendWelcomeEmail(email).catch(err => console.error('Email error:', err));
    } catch (err) {
        if (err.message?.includes('duplicate') || err.code === '23505') {
            return res.status(409).json({ error: 'Cet email est déjà inscrit.' });
        }
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/subscribers', async (_req, res) => {
    try {
        const subscribers = await getAllSubscribers();
        res.json(subscribers);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// --- News ---
app.get('/api/news', async (req, res) => {
    try {
        const { category, sort, search } = req.query;
        const filters = {};
        if (category) filters.category = category;
        if (sort) filters.sort = sort;
        if (search) filters.search = search;
        const news = await getAllNews(filters);
        res.json(news);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/news/categories', async (_req, res) => {
    try {
        const categories = await getCategories();
        res.json(categories);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/news/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const article = await getNewsById(Number(id));
        if (!article) {
            return res.status(404).json({ error: 'Article non trouvé.' });
        }
        res.json(article);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.post('/api/news/:id/like', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await likeNews(Number(id));
        res.json({ likes_count: result.likes_count });
    } catch {
        res.status(404).json({ error: 'Article non trouvé.' });
    }
});

app.get('/api/news/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await getCommentsByNewsId(Number(id));
        res.json(comments);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.post('/api/news/:id/comments', async (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Auteur et contenu requis.' });
    }
    try {
        await addComment(Number(id), author, content);
        const comments = await getCommentsByNewsId(Number(id));
        res.json(comments);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// --- Community Threads ---
app.get('/api/community/threads', async (_req, res) => {
    try {
        const threads = await getAllThreads();
        res.json(threads);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.post('/api/community/threads', async (req, res) => {
    const { title, author, content } = req.body;
    if (!title || !author || !content) {
        return res.status(400).json({ error: 'Titre, auteur et contenu requis.' });
    }
    try {
        await addThread(title, author, content);
        const threads = await getAllThreads();
        res.json(threads);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.get('/api/community/threads/:id/replies', async (req, res) => {
    try {
        const { id } = req.params;
        const replies = await getRepliesByThreadId(Number(id));
        res.json(replies);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

app.post('/api/community/threads/:id/replies', async (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Auteur et contenu requis.' });
    }
    try {
        await addReply(Number(id), author, content);
        const replies = await getRepliesByThreadId(Number(id));
        res.json(replies);
    } catch {
        res.status(500).json({ error: 'Erreur serveur.' });
    }
});

// --- Sitemap dynamique ---
app.get('/sitemap.xml', async (_req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const staticPages = [
            { loc: '/', changefreq: 'weekly', priority: '1.0' },
            { loc: '/actualites', changefreq: 'daily', priority: '0.8' },
        ];

        const articles = await getNewsForSitemap();

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        for (const page of staticPages) {
            xml += '  <url>\n';
            xml += `    <loc>${SITE_URL}${page.loc}</loc>\n`;
            xml += `    <lastmod>${today}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += '  </url>\n';
        }

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
    } catch {
        res.status(500).send('Erreur lors de la génération du sitemap.');
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur newsletter démarré sur http://localhost:${PORT}`);
});
