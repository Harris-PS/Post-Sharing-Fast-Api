import { useState } from 'react';
import axios from 'axios';
import { IKContext, IKUpload } from 'imagekitio-react';
import { Image, Loader2, X } from 'lucide-react';

function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [imageName, setImageName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const onError = (err) => {
    setIsUploading(false);
    alert('Image upload failed: ' + (err.message || JSON.stringify(err)));
  };

  const onSuccess = (res) => {
    setImageUrl(res.url);
    setImageName(res.name || res.filePath?.split('/').pop() || 'Uploaded image');
    setIsUploading(false);
  };

  const onUploadStart = (evt) => {
    // Capture filename immediately when user selects a file
    if (evt && evt.target && evt.target.files && evt.target.files[0]) {
      const fileName = evt.target.files[0].name;
      setImageName(fileName);
    }
    setIsUploading(true);
  }

  const removeImage = () => {
    setImageUrl(null);
    setImageName(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/posts', { title, content, image_url: imageUrl });
      onPostCreated(response.data);
      setTitle('');
      setContent('');
      setImageUrl(null);
      setImageName(null);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    }
  };

  const authenticator = async () => {
    try {
      const response = await fetch('/api/auth/imagekit');
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const { signature, expire, token } = data;
      return { signature, expire, token };
    } catch (error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    }
  };

  const pubKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
  const urlEnd = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

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
        urlEndpoint={urlEnd}
        publicKey={pubKey}
        authenticator={authenticator}
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

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <p style={{
              marginBottom: '0.8rem', 
              fontSize: '0.95rem', 
              color: imageUrl ? 'rgb(34, 197, 94)' : 'var(--text-muted)',
              fontWeight: imageUrl ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              {imageUrl ? (
                <>
                  <svg 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5"></path>
                  </svg>
                  Image Attached
                </>
              ) : (
                'Attach Image'
              )}
            </p>
            
            {/* Display filename prominently when image is uploaded */}
            {imageName && (
              <div style={{
                marginBottom: '1rem',
                padding: '1rem 1.25rem',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(34, 197, 94, 0.05))',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: 'var(--text-color)',
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.2)'
              }}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ color: 'rgb(34, 197, 94)', flexShrink: 0 }}
                >
                  <path d="M20 6L9 17l-5-5"></path>
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Selected Image:</div>
                  <div style={{ wordBreak: 'break-all', color: 'rgb(34, 197, 94)' }}>{imageName}</div>
                </div>
              </div>
            )}
            
            {!imageUrl ? (
              <div style={{ position: 'relative' }}>
                <IKUpload
                  id="image-upload"
                  onError={onError}
                  onSuccess={onSuccess}
                  onUploadStart={onUploadStart}
                  isPrivateFile={false}
                  useUniqueFileName={true}
                  style={{ display: 'none' }}
                />
                <label 
                  htmlFor="image-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem',
                    background: 'rgba(15, 23, 42, 0.3)',
                    border: '2px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    transition: 'var(--transition)',
                    color: 'var(--text-muted)',
                    gap: '0.5rem'
                  }}
                  onMouseOver={(e) => !isUploading && (e.currentTarget.style.borderColor = 'var(--primary-color)', e.currentTarget.style.color = 'var(--text-color)')}
                  onMouseOut={(e) => !isUploading && (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)', e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin" size={32} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Uploading{imageName ? `: ${imageName}` : '...'}</span>
                    </>
                  ) : (
                    <>
                      <Image size={32} />
                      <span>Click to upload image</span>
                    </>
                  )}
                </label>
              </div>
            ) : (
              <div style={{ position: 'relative', marginTop: '0', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={imageUrl} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    padding: '0.5rem',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'var(--transition)',
                    backdropFilter: 'blur(4px)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'}
                >
                  <X size={20} />
                </button>
              </div>
            )}
            
            {/* Add keyframe for spin animation if not globally available */}
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
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
               width: '100%',
               opacity: isUploading ? 0.7 : 1
          }}>Publish Post</button>
        </form>
      </IKContext>
    </section>
  );
}

export default CreatePost;
