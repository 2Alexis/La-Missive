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
    addReply
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

app.listen(PORT, () => {
    console.log(`🚀 Serveur newsletter démarré sur http://localhost:${PORT}`);
});
