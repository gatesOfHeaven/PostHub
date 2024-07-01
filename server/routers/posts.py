from fastapi import (
    APIRouter,
    Request,
    Depends,
    Body,
    Query,
    Path
)
from fastapi.responses import JSONResponse
from utils.models import *
from utils.db_conn import get_db_pool, cache
from utils import auth


router = APIRouter(prefix = '/posts')


@router.get('/', response_model = ReadPostsResponseData)
@cache()
async def read_posts(
    request: Request,
    user_id = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    page_id: int = Query(
        gt = 0,
        description = 'Pagination page identificator [1, n]'
    ),
    page_size: int = Query(
        gt = 0,
        description = 'Count of posts per page'
    )
):
    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = await get_posts(
            user_id = user_id,
            db_pool = db_pool,
            page_id = page_id,
            page_size = page_size
        )
    )


async def get_posts(user_id: int, db_pool, page_id: int, page_size: int) -> ReadPostsResponseData:
    async with db_pool.acquire() as conn:
        pages_count = int(await conn.fetchval(
            'SELECT CEIL(COUNT(id) / $1::float) FROM Posts',
            page_size
        ))
        if pages_count < page_id:
            if pages_count == 0:
                return {
                    'page': [],
                    'page_id': 0,
                    'pages_count': pages_count
                }
            else:
                page_id = 1

        result = await conn.fetch(
            """
                WITH LikesCounts AS (
                    SELECT post_id, COUNT(user_id) AS likes_count
                    FROM Post_Likes
                    GROUP BY post_id
                ),
                CommentsCounts AS (
                    SELECT post_id, COUNT(author_id) AS comments_count
                    FROM Post_Comments
                    GROUP BY post_id
                )
                SELECT
                    p.id AS id,
                    p.posted_time AS posted_time,
                    p.text_content AS text_content,
                    p.author_id AS author_id,
                    a.username AS author_username,
                    a.fullname AS author_fullname,
                    COALESCE(lc.likes_count, 0) AS likes_count,
                    COALESCE(cc.comments_count, 0) AS comments_count
                FROM Posts p
                JOIN Users a
                    ON p.author_id = a.id
                LEFT JOIN LikesCounts lc
                    ON p.id = lc.post_id
                LEFT JOIN CommentsCounts cc
                    ON p.id = cc.post_id
                ORDER BY p.posted_time DESC
                LIMIT $2
                OFFSET ($1 - 1) * $2
            """, page_id, page_size
        )

        posts = []
        for row in result:
            images = await conn.fetch(
                'SELECT id, url FROM Post_Images WHERE post_id = $1',
                row['id']
            )
            posts.append({
                'id': row['id'],
                'author_id': row['author_id'],
                'author_username': row['author_username'],
                'author_fullname': row['author_fullname'],
                'posted_time': str(row['posted_time']),
                'text_content': row['text_content'],
                'likes_count': row['likes_count'],
                'comments_count': row['comments_count'],
                'liked': await conn.fetchval(
                    'SELECT COUNT(user_id) FROM Post_Likes WHERE post_id = $1 AND user_id = $2',
                    row['id'], user_id
                ) == 1,
                'images': [{
                    'id': image['id'],
                    'url': image['url']
                } for image in images]
            })

    return {
        'page': posts,
        'page_id': page_id,
        'pages_count': pages_count
    }


@router.post('/new', response_model = CreatePostResponseData)
async def create(
    user_id = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    data: CreatePostRequestData = Body()
):
    async with db_pool.acquire() as conn:
        post_id = await conn.fetchval('SELECT COUNT(id) FROM Posts')
        
        await conn.execute(
            """
                INSERT INTO Posts (
                    id, author_id, posted_time, text_content
                ) VALUES ($1, $2, $3, $4)
            """, post_id, user_id, datetime.now(), data.text_content
        )

        for url in data.images:
            await conn.execute(
                """
                    INSERT INTO Post_Images (id, post_id, url) VALUES ((
                        SELECT COUNT(id) FROM Post_Images
                    ), $1, $2)
                """, post_id, url
            )

    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = {
            'post_id': post_id,
            'detail': 'Posted successful'
        }
    )


@router.get('/{post_id}', response_model = GetPostResponseData)
@cache()
async def read_post(
    request: Request,
    user_id: int = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    post_id: int = Path(
        ge = 0,
        description = 'Post\'s ID to get its info and comments'
    )
):
    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = await get_post(
            user_id = user_id,
            db_pool = db_pool,
            post_id = post_id
        )
    )
    
async def get_post(user_id: int, db_pool, post_id: int) -> GetPostResponseData:
    async with db_pool.acquire() as conn:
        post = await conn.fetchrow(
            """
                SELECT
                    p.id AS id,
                    p.text_content AS text_content,
                    p.posted_time AS posted_time,
                    p.author_id AS author_id,
                    a.fullname AS author_fullname,
                    a.username AS author_username,
                    COUNT(l.user_id) AS likes_count
                FROM Posts p
                INNER JOIN Users a
                ON p.author_id = a.id
                LEFT JOIN Post_Likes l
                ON p.id = l.post_id
                WHERE p.id = $1
                GROUP BY
                    p.id,
                    a.id,
                    a.fullname,
                    a.username
            """, post_id
        )
        
        images = await conn.fetch(
            'SELECT id, url FROM Post_Images WHERE post_id = $1',
            post_id
        )

        comments = await conn.fetch(
            """
                SELECT
                    c.id AS id,
                    c.text_content AS text_content,
                    c.posted_time AS posted_time,
                    c.author_id AS author_id,
                    a.fullname AS author_fullname,
                    a.username AS author_username,
                    COUNT(l.user_id) AS likes_count
                FROM Post_Comments c
                INNER JOIN Users a
                ON c.author_id = a.id
                LEFT JOIN Comment_Likes l
                ON c.id = l.comment_id
                WHERE c.post_id = $1
                GROUP BY
                    c.id,
                    a.id,
                    a.fullname,
                    a.username
                ORDER BY likes_count DESC
            """, post_id
        )

        return {
            'post': {
                'id': post['id'],
                'text_content': post['text_content'],
                'posted_time': str(post['posted_time']),
                'author_id': post['author_id'],
                'author_fullname': post['author_fullname'],
                'author_username': post['author_username'],
                'likes_count': post['likes_count'],
                'liked': await conn.fetchval(
                    'SELECT COUNT(user_id) FROM Post_Likes WHERE post_id = $1 AND user_id = $2',
                    post_id, user_id
                ) == 1,
                'images': [{
                    'id': image['id'],
                    'url': image['url']
                } for image in images]
            },
            'comments': [{
                'id': comment['id'],
                'author_id': comment['author_id'],
                'author_fullname': comment['author_fullname'],
                'author_username': comment['author_username'],
                'text_content': comment['text_content'],
                'posted_time': str(comment['posted_time']),
                'likes_count': comment['likes_count'],
                'liked': await conn.fetchval(
                    'SELECT COUNT(user_id) FROM Comment_Likes WHERE comment_id = $1 AND user_id = $2',
                    comment['id'], user_id
                ) == 1
            } for comment in comments]
        }


@router.put('/{post_id}/like', response_model = LikeResponseData)
async def like(
    user_id = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    post_id: int = Path(
        ge = 0,
        description = 'Post identificator to like'
    )
):
    async with db_pool.acquire() as conn:
        liked = await conn.fetchval(
            'SELECT COUNT(user_id) FROM Post_Likes WHERE post_id = $1 AND user_id = $2',
            post_id, user_id
        ) == 1

        if liked:
            query = 'DELETE FROM Post_Likes WHERE post_id = $1 and user_id = $2'
        else:
            query = 'INSERT INTO Post_Likes(post_id, user_id) VALUES ($1, $2)'
        
        await conn.execute(query, post_id, user_id)
        likes_count = await conn.fetchval(
            'SELECT COUNT(user_id) FROM Post_Likes WHERE post_id = $1',
            post_id
        )

    liked = not liked
    if liked:
        detail = 'Liked successful'
    else:
        detail = 'Unliked successful'

    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = {
            'liked': liked,
            'likes_count': likes_count,
            'detail': detail
        }
    )


@router.post('/{post_id}/comment', response_model = GetPostResponseData)
async def comment(
    user_id = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    post_id: int = Path(
        ge = 0,
        description = 'Post identificator to comment'
    ),
    data: CommentRequestData = Body()
):
    async with db_pool.acquire() as conn:
        await conn.execute(
            """
                INSERT INTO Post_Comments (id, post_id, text_content, author_id, posted_time)
                VALUES (
                    (SELECT COUNT(id) FROM Post_Comments),
                    $1, $2, $3, $4
                )
            """, post_id, data.text_content, user_id, datetime.now()
        )

    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = await get_post(
            user_id = user_id,
            db_pool = db_pool,
            post_id = post_id
        )
    )


@router.put('/comments/{comment_id}/like')
async def like_comment(
    user_id = Depends(auth.verify_token),
    db_pool = Depends(get_db_pool),
    comment_id: int = Path(
        ge = 0,
        description = 'Comment identificator to like'
    )
):
    async with db_pool.acquire() as conn:
        liked = await conn.fetchval(
            'SELECT COUNT(user_id) FROM Comment_Likes WHERE comment_id = $1 AND user_id = $2',
            comment_id, user_id
        ) == 1

        if liked:
            query = 'DELETE FROM Comment_Likes WHERE comment_id = $1 and user_id = $2'
        else:
            query = 'INSERT INTO Comment_Likes(comment_id, user_id) VALUES ($1, $2)'
        
        await conn.execute(query, comment_id, user_id)
        likes_count = await conn.fetchval(
            'SELECT COUNT(user_id) FROM Comment_Likes WHERE comment_id = $1',
            comment_id
        )

    liked = not liked
    if liked:
        detail = 'Liked successful'
    else:
        detail = 'Unliked successful'

    return JSONResponse(
        headers = { 'Authorization': f'Bearer {await auth.generate_token(user_id)}' },
        content = {
            'liked': liked,
            'likes_count': likes_count,
            'detail': detail
        }
    )