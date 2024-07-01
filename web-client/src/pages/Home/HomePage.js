import { useEffect, useState } from 'react';
import Post from '../../widgets/Post';
import UploadPost from '../../widgets/UploadPost';
import { useAuth } from '../../app/AuthProvider';
import Pagination from '../../widgets/Pagination';
import useFetch from '../../app/useFetch';
import Loanding from '../../widgets/Loanding';


function HomePage() {
    const { auth, setAuth } = useAuth();
    const fetchData = useFetch();
    const [loanding, setLoanding] = useState(true);
    const [feed, setFeed] = useState({
        currentPage: 1,
        pagesCount: 0,
        posts: []
    });
    const setCurrentPage = pageNum => setFeed(prevFeed => ({
        ...prevFeed,
        currentPage: pageNum
    }));

    useEffect(() => fetchData({
        endpoint: `posts?page_id=${feed.currentPage}&page_size=${7}`,
        method: 'GET',
        auth, setAuth,
        thenFunc: responseData =>
            setFeed(prevFeed => ({
                ...prevFeed,
                pagesCount: responseData.pages_count,
                posts: responseData.page
            })),
        finallyFunc: () => setLoanding(false)
    }), [feed.currentPage]);

    return (<>
        <UploadPost setCurrentPage={ setCurrentPage } />
        {
            !loanding ? feed.posts.map(post => (
                <Post
                    key={ post.id }
                    author={{
                        fullname: post.author_fullname,
                        username: post.author_username,
                        avatarUrl: 'https://i.pinimg.com/736x/0c/4a/8c/0c4a8c8bd160bddb029995656b2480bf.jpg',
                        following: false
                    }}
                    post={{
                        id: post.id,
                        postedTime: post.posted_time,
                        images: post.images,
                        liked: post.liked,
                        likes: post.likes_count,
                        comments: post.comments_count
                    }}
                >
                    { post.text_content }
                </Post>
            )) : <Loanding />
        }

        <Pagination
            currentPage={ feed.currentPage }
            pagesCount={ feed.pagesCount }
            setCurrentPage={ setCurrentPage }
        />
    </>);
}

export default HomePage;