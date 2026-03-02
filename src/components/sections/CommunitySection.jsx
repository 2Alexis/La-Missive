import { useState, useEffect } from 'react';
import ScrollReveal from '../animations/ScrollReveal';
import './CommunitySection.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function CommunitySection() {
    const [threads, setThreads] = useState([]);
    const [activeThread, setActiveThread] = useState(null);
    const [replies, setReplies] = useState({});
    const [showNewThread, setShowNewThread] = useState(false);
    const [threadForm, setThreadForm] = useState({ title: '', author: '', content: '' });
    const [replyForm, setReplyForm] = useState({ author: '', content: '' });

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const res = await fetch(`${API_URL}/api/community/threads`);
            const data = await res.json();
            setThreads(data);
        } catch { }
    };

    const viewThread = async (id) => {
        if (activeThread === id) {
            setActiveThread(null);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/community/threads/${id}/replies`);
            const data = await res.json();
            setReplies(prev => ({ ...prev, [id]: data }));
            setActiveThread(id);
        } catch { }
    };

    const submitThread = async (e) => {
        e.preventDefault();
        if (!threadForm.title || !threadForm.author || !threadForm.content) return;

        try {
            const res = await fetch(`${API_URL}/api/community/threads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(threadForm),
            });
            const data = await res.json();
            setThreads(data);
            setThreadForm({ title: '', author: '', content: '' });
            setShowNewThread(false);
        } catch { }
    };

    const submitReply = async (e, threadId) => {
        e.preventDefault();
        if (!replyForm.author || !replyForm.content) return;

        try {
            const res = await fetch(`${API_URL}/api/community/threads/${threadId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(replyForm),
            });
            const data = await res.json();
            setReplies(prev => ({ ...prev, [threadId]: data }));
            setReplyForm({ author: '', content: '' });
            fetchThreads(); // Update reply count
        } catch { }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        });
    };

    return (
        <section className="community section-padding" id="community">
            <div className="container container--narrow">
                <ScrollReveal>
                    <h2 className="section-title">Communauté</h2>
                    <p className="section-subtitle">
                        Un espace d'échange pour les lecteurs de La Missive. Partagez vos idées, débattez, recommandez.
                    </p>
                </ScrollReveal>

                <ScrollReveal delay={0.1}>
                    <div className="community__header">
                        <button
                            className="form-button"
                            onClick={() => setShowNewThread(!showNewThread)}
                            id="new-thread-btn"
                        >
                            {showNewThread ? 'Annuler' : '+ Nouveau sujet'}
                        </button>
                    </div>
                </ScrollReveal>

                {showNewThread && (
                    <ScrollReveal>
                        <form className="community__new-thread" onSubmit={submitThread}>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Titre du sujet"
                                value={threadForm.title}
                                onChange={(e) => setThreadForm(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                            <input
                                className="form-input"
                                type="text"
                                placeholder="Votre pseudo"
                                value={threadForm.author}
                                onChange={(e) => setThreadForm(prev => ({ ...prev, author: e.target.value }))}
                                required
                            />
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Votre message..."
                                value={threadForm.content}
                                onChange={(e) => setThreadForm(prev => ({ ...prev, content: e.target.value }))}
                                required
                            />
                            <button type="submit" className="cta-button" id="submit-thread-btn">
                                <span>Publier le sujet</span>
                            </button>
                        </form>
                    </ScrollReveal>
                )}

                <div className="community__threads">
                    {threads.map((thread, i) => (
                        <ScrollReveal key={thread.id} delay={i * 0.08}>
                            <div className={`community__thread ${activeThread === thread.id ? 'community__thread--active' : ''}`}>
                                <div className="community__thread-header" onClick={() => viewThread(thread.id)}>
                                    <div className="community__thread-info">
                                        <h3 className="community__thread-title">{thread.title}</h3>
                                        <div className="community__thread-meta">
                                            <span className="community__thread-author">{thread.author}</span>
                                            <span className="community__thread-sep">•</span>
                                            <span className="community__thread-date">{formatDate(thread.created_at)}</span>
                                            <span className="community__thread-sep">•</span>
                                            <span className="community__thread-replies">{thread.reply_count} réponse{thread.reply_count !== 1 ? 's' : ''}</span>
                                        </div>
                                    </div>
                                    <svg className="community__thread-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>

                                {activeThread === thread.id && (
                                    <div className="community__thread-body">
                                        <p className="community__thread-content">{thread.content}</p>

                                        <div className="community__replies">
                                            {(replies[thread.id] || []).map(reply => (
                                                <div key={reply.id} className="community__reply">
                                                    <strong className="community__reply-author">{reply.author}</strong>
                                                    <p className="community__reply-text">{reply.content}</p>
                                                    <span className="community__reply-date">{formatDate(reply.created_at)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <form className="community__reply-form" onSubmit={(e) => submitReply(e, thread.id)}>
                                            <input
                                                className="form-input"
                                                type="text"
                                                placeholder="Votre pseudo"
                                                value={replyForm.author}
                                                onChange={(e) => setReplyForm(prev => ({ ...prev, author: e.target.value }))}
                                                required
                                            />
                                            <textarea
                                                className="form-input form-textarea"
                                                placeholder="Votre réponse..."
                                                value={replyForm.content}
                                                onChange={(e) => setReplyForm(prev => ({ ...prev, content: e.target.value }))}
                                                required
                                            />
                                            <button type="submit" className="form-button">Répondre</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
