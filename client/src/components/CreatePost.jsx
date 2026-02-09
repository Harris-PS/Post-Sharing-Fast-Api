import { useState } from 'react';
import axios from 'axios';
import { IKContext, IKUpload } from 'imagekitio-react';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onError = (err) => {
    console.log("Error", err);
    setIsUploading(false);
    alert('Image upload failed');
  };

  const onSuccess = (res) => {
    console.log("Success", res);
    setImageUrl(res.url);
    setIsUploading(false);
  };

  const onUploadStart = () => {
    setIsUploading(true);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/posts', { title, content, image_url: imageUrl });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setImageUrl(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  return (
    <section className="create-post" style={{
        background: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: '3rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
    }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Post</h2>
      
      <IKContext 
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
        authenticationEndpoint="http://localhost:8000/api/auth/imagekit"
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'var(--text-color)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  transition: 'var(--transition)'
              }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <textarea
              placeholder="What's on your mind?"
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: 'var(--text-color)',
                  fontFamily: 'inherit',
                  fontSize: '1rem',
                  transition: 'var(--transition)'
              }}
            ></textarea>
          </div>

          <div className="form-group" style={{ marginBottom: '1.2rem' }}>
            <p style={{marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)'}}>Attach Image (Optional)</p>
            <IKUpload
              onError={onError}
              onSuccess={onSuccess}
              onUploadStart={onUploadStart}
              style={{
                  color: 'var(--text-color)',
                  padding: '0.5rem 0'
              }}
            />
            {isUploading && <p style={{color: 'var(--primary-color)', fontSize: '0.9rem'}}>Uploading...</p>}
            {imageUrl && (
                <div style={{marginTop: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <img src={imageUrl} alt="Preview" style={{maxWidth: '100%', maxHeight: '200px', display: 'block'}} />
                </div>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isUploading} style={{
               background: isUploading ? 'var(--text-muted)' : 'var(--primary-color)',
               color: 'white',
               border: 'none',
               padding: '1rem 2rem',
               borderRadius: '12px',
               fontSize: '1rem',
               fontWeight: 600,
               cursor: isUploading ? 'not-allowed' : 'pointer',
               transition: 'var(--transition)',
               width: '100%'
          }}>Publish Post</button>
        </form>
      </IKContext>
    </section>
  );
}

export default CreatePost;
