from uuid import UUID
from pydantic import BaseModel, ConfigDict


class PostCreate(BaseModel):
    title: str
    content: str


class PostResponse(PostCreate):
    id: UUID
    model_config = ConfigDict(from_attributes=True)

