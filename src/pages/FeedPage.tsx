import React from 'react';
import Header from '../components/layout/Header';
import BottomNav from '../components/layout/BottomNav';
import PostCard from '../components/feed/PostCard';
import PostComposer from '../components/feed/PostComposer';
import { usePosts } from '../hooks/usePosts';

export default function FeedPage() {
  const { posts, loading, createPost, deletePost } = usePosts();

  return (
    <div className="app-layout">
      <Header title="Paganismo" subtitle="Invocaciones" />
      <main className="page-content page-enter">
        <PostComposer onSubmit={createPost} />
        <div className="mt-16" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div className="loader"><div className="loader-ring" /></div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">◈</div>
              <h3>Sin invocaciones aún</h3>
              <p>Sé el primero en compartir algo con el colectivo.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onDelete={deletePost} />
            ))
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
