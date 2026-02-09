from contextlib import asynccontextmanager
import os
from uuid import UUID
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.schemas import PostCreate, PostResponse
from app.db import get_db, engine, Base
from app.models import Post

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(lifespan=lifespan)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount assets (JS/CSS)
app.mount("/assets", StaticFiles(directory="client/dist/assets"), name="assets")

# Serve React App (SPA)
@app.get("/", include_in_schema=False)
async def serve_spa():
    return FileResponse("client/dist/index.html")

# Fallback for client-side routing (optional, but good practice)
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    if request.url.path.startswith("/api"):
         return JSONResponse({"detail": "Not Found"}, status_code=404)
    return FileResponse("client/dist/index.html")

@app.get("/posts", response_model=list[PostResponse])
async def get_all_posts(limit: int = None, db: AsyncSession = Depends(get_db)):
    query = select(Post)
    if limit:
        query = query.limit(limit)
    result = await db.execute(query)
    posts = result.scalars().all()
    return posts

@app.get("/posts/{id}", response_model=PostResponse)
async def get_post(id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

    return post
    
# ImageKit Initialization
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key=os.getenv("IMAGEKIT_PUBLIC_KEY"),
    private_key=os.getenv("IMAGEKIT_PRIVATE_KEY"),
    url_endpoint=os.getenv("IMAGEKIT_URL_ENDPOINT")
)

@app.get("/api/auth/imagekit")
def get_imagekit_auth():
    auth_params = imagekit.get_authentication_parameters()
    return auth_params

@app.post("/posts", response_model=PostResponse)
async def create_post(post: PostCreate, db: AsyncSession = Depends(get_db)):
    new_post = Post(title=post.title, content=post.content, image_url=post.image_url)
    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)
    return new_post

@app.delete("/posts/{id}")
async def delete_post(id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Post).where(Post.id == id))
    post = result.scalar_one_or_none()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    await db.delete(post)
    await db.commit()
    return {"message": "Post deleted successfully"}
