import { useState, useEffect } from 'react';
import axios from 'axios';
import CreatePost from './components/CreatePost';
import PostList from './components/PostList';
import './App.css'; // Optional: for component-specific styles if any.

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/posts');
      // Reverse to show newest first if API returns oldest first
      setPosts(response.data.reverse()); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
        await axios.delete(`/posts/${id}`);
        setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
    }
  };

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeInDown 0.8s ease-out' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 600,
          background: 'linear-gradient(135deg, #818cf8, #c4b5fd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>ShareApp</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Share your ideas with the world.</p>
      </header>

      <main>
        <CreatePost onPostCreated={handlePostCreated} />
        <section className="posts-feed">
          <h2 style={{ marginBottom: '1.5rem', animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}>Recent Posts</h2>
          <PostList posts={posts} onDelete={handleDeletePost} />
        </section>
      </main>
    </div>
  );
}

export default App;
