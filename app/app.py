from contextlib import asynccontextmanager
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

# Mount assets (JS/CSS)
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# Serve React App (SPA)
@app.get("/", include_in_schema=False)
async def serve_spa():
    return FileResponse("frontend/dist/index.html")

# Fallback for client-side routing (optional, but good practice)
@app.exception_handler(404)
async def custom_404_handler(request, exc):
    if request.url.path.startswith("/api"):
         return JSONResponse({"detail": "Not Found"}, status_code=404)
    return FileResponse("frontend/dist/index.html")

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

@app.post("/posts", response_model=PostResponse)
async def create_post(post: PostCreate, db: AsyncSession = Depends(get_db)):
    new_post = Post(title=post.title, content=post.content)
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
