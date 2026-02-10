import { Trash2 } from 'lucide-react';

function PostList({ posts, onDelete }) {
  return (
    <div className="posts-grid" style={{ display: 'grid', gap: '1.5rem' }}>
      {posts.map((post, index) => (
        <div key={post.id} className="post-card" style={{
            background: 'var(--card-bg)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            transition: 'var(--transition)',
            animation: 'fadeInUp 0.5s ease-out backwards',
            animationDelay: `${index * 0.1}s`,
            position: 'relative'
        }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.8rem', color: '#e2e8f0' }}>{post.title}</h3>
          {post.image_url && (
            <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.5)' }}>
              <img 
                src={post.image_url} 
                alt={post.title} 
                style={{ width: '100%', height: 'auto', display: 'block' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>{post.content}</p>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(post.id)} 
            title="Delete Post"
            style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'var(--transition)',
                padding: '0.5rem',
                borderRadius: '8px'
            }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default PostList;
