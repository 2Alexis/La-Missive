import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ SUPABASE_URL et SUPABASE_KEY doivent être définis dans .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Subscribers ---

export const addSubscriber = async (email) => {
  const { data, error } = await supabase
    .from('subscribers')
    .insert({ email })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getAllSubscribers = async () => {
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('subscribed_at', { ascending: false });
  if (error) throw error;
  return data;
};

// --- News ---

export const getAllNews = async (filters = {}) => {
  let query = supabase.from('news').select('*');

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
  }

  if (filters.sort === 'oldest') {
    query = query.order('created_at', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const getNewsById = async (id) => {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
};

export const likeNews = async (id) => {
  // Récupérer le nombre actuel de likes
  const article = await getNewsById(id);
  if (!article) throw new Error('Article non trouvé');

  const { data, error } = await supabase
    .from('news')
    .update({ likes_count: article.likes_count + 1 })
    .eq('id', id)
    .select('likes_count')
    .single();
  if (error) throw error;
  return data;
};

export const getCategories = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('category')
    .order('category');
  if (error) throw error;
  // Retourner les catégories uniques
  return [...new Set(data.map(r => r.category))];
};

// --- Comments ---

export const getCommentsByNewsId = async (newsId) => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('news_id', newsId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const addComment = async (newsId, author, content) => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ news_id: newsId, author, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- Community Threads ---

export const getAllThreads = async () => {
  const { data: threads, error } = await supabase
    .from('threads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // Ajouter le nombre de réponses pour chaque thread
  const threadsWithCount = await Promise.all(
    threads.map(async (thread) => {
      const { count } = await supabase
        .from('replies')
        .select('*', { count: 'exact', head: true })
        .eq('thread_id', thread.id);
      return { ...thread, reply_count: count || 0 };
    })
  );

  return threadsWithCount;
};

export const addThread = async (title, author, content) => {
  const { data, error } = await supabase
    .from('threads')
    .insert({ title, author, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- Replies ---

export const getRepliesByThreadId = async (threadId) => {
  const { data, error } = await supabase
    .from('replies')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
};

export const addReply = async (threadId, author, content) => {
  const { data, error } = await supabase
    .from('replies')
    .insert({ thread_id: threadId, author, content })
    .select()
    .single();
  if (error) throw error;
  return data;
};

// --- Sitemap ---

export const getNewsForSitemap = async () => {
  const { data, error } = await supabase
    .from('news')
    .select('id, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export default supabase;
