from uuid import UUID
from pydantic import BaseModel, ConfigDict


class PostCreate(BaseModel):
    title: str
    content: str
    image_url: str | None = None


class PostResponse(PostCreate):
    id: UUID
    image_url: str | None = None
    model_config = ConfigDict(from_attributes=True)

