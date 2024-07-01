from pydantic import BaseModel, Field
from typing import Annotated, List
from datetime import datetime


# auth
class SignUpRequestData(BaseModel):
    username: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9_-]+$',
        min_length = 3,
        max_length = 15,
        description = 'Username must includes only latin letters, digits, \'_\' and \'-\' symbols and be between 3 and 15 characters long'
    )]
    fullname: Annotated[str | None, Field(
        pattern = r'^[A-Za-z0-9 _-]+$',
        min_length = 3,
        max_length = 25
    )] = None
    password: Annotated[str, Field(
        pattern = r'^[\x21-\x7E]+$',
        min_length = 5,
        max_length = 15,
        description = 'Password must includes only default keyboard symbols and be between 5 and 15 characters long'
    )]


class SignInRequestData(BaseModel):
    username: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9_-]+$',
        min_length = 3,
        max_length = 15,
        description = 'Username must includes only latin letters, digits, \'_\' and \'-\' symbols and be between 3 and 15 characters long'
    )]
    password: Annotated[str, Field(
        pattern = r'^[\x21-\x7E]+$',
        min_length = 5,
        max_length = 15,
        description = 'Password must includes only default keyboard symbols and be between 5 and 15 characters long'
    )]


class SignResponseData(BaseModel):
    id: Annotated[int, Field(
        ge = 0,
        description = 'User\'s unique identificator'
    )]
    username: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9_-]+$',
        min_length = 3,
        max_length = 15
    )]
    fullname: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9 _-]+$',
        min_length = 3,
        max_length = 25
    )]
    detail: str


# posts
class Image(BaseModel):
    id: Annotated[int, Field(ge = 0)]
    url: Annotated[str, Field(min_length = 10)]


class Post(BaseModel):
    id: Annotated[int, Field(ge = 0)]
    author_id: Annotated[int, Field(ge = 0)]
    author_username: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9_-]+$',
        min_length = 3,
        max_length = 15        
    )]
    author_fullname: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9 _-]+$',
        min_length = 3,
        max_length = 25
    )]
    posted_time: datetime
    text_content: str
    likes_count: Annotated[int, Field(ge = 0)]
    liked: bool
    images: List[Image]


class Comment(BaseModel):
    id: Annotated[int, Field(ge = 0)]
    author_id: Annotated[int, Field(ge = 0)]
    author_username: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9_-]+$',
        min_length = 3,
        max_length = 15        
    )]
    author_fullname: Annotated[str, Field(
        pattern = r'^[A-Za-z0-9 _-]+$',
        min_length = 3,
        max_length = 25
    )]
    posted_time: datetime
    text_content: str
    likes_count: Annotated[int, Field(ge = 0)]
    liked: bool


class ReadPostsRequestData(BaseModel):
    page_id: Annotated[int, Field(
        gt = 0,
        description = 'Pagination page identificator [1, n]'
    )]
    page_id: Annotated[int, Field(
        ge = 0,
        description = 'Current page number'
    )]
    page_size: Annotated[int, Field(
        gt = 0,
        description = 'Count of posts per page'
    )]


class ReadPostsResponseData(BaseModel):
    page: Annotated[List[Post], Field(
        description = 'Posts from (id - 1) * size to id * size'
    )]
    pages_count: int


class CreatePostRequestData(BaseModel):
    text_content: str
    images: List[str]


class CreatePostResponseData(BaseModel):
    post_id: Annotated[int, Field(ge = 0)]
    detail: str


class GetPostResponseData(BaseModel):
    post: Post
    comments: List[Comment]


class LikeResponseData(BaseModel):
    liked: bool
    likes_count: int
    detail: str


class CommentRequestData(BaseModel):
    text_content: Annotated[str, Field(
        min_length = 1,
        max_length = 255
    )]