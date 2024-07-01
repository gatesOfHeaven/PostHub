import { Link, useParams } from 'react-router-dom';
import styles from './Post.module.css';
import { useEffect, useRef, useState } from 'react';
import Avatar from '../../components/Avatar';
import { sincePosted } from '../../widgets/Post';
import useFetch from '../../app/useFetch';
import { useAuth } from '../../app/AuthProvider';
import Button from '../../components/Button';
import Gallery from '../../widgets/Gallery';
import Comment from '../../widgets/Comment';
import TextField from '../../components/TextField';
import Loanding from '../../widgets/Loanding';

function PostPage() {
    const { auth, setAuth } = useAuth();
    const fetchData = useFetch();
    const { id } = useParams();
    const commentFieldRef = useRef(null);

    const [ loanding, setLoanding ] = useState(true);
    const [ newComment, setNewComment ] = useState('');
    const [postData, setPostData] = useState({
        id,
        author_id: -404,
        author_username: 'john',
        author_fullname: 'John Doe',
        author_avatar_url: 'https://i.pinimg.com/736x/b2/59/ef/b259ef62aa2753a5fb8a403250ed8efd.jpg',
        posted_time: '2020-10-22T13:00:00',
        text_content: 'Post not found',
        likes_count: -404,
        liked: false,
        images:[],
        comments: [
            {
                id,
                author_id: -404,
                author_username: 'john',
                author_fullname: 'John Doe',
                author_avatar_url: 'https://i.pinimg.com/736x/b2/59/ef/b259ef62aa2753a5fb8a403250ed8efd.jpg',
                posted_time: '2020-10-22T13:00:00',
                text_content: 'sad(((',
                likes_count: -404,
                liked: true
            }
        ]
    });

    const reload = responseData => setPostData({
        ...responseData.post,
        comments: responseData.comments
    });

    useEffect(() => fetchData({
        endpoint: `posts/${postData.id}`,
        method: 'GET',
        auth, setAuth,
        thenFunc: reload,
        finallyFunc: () => setLoanding(false)
    }), []);

    const onLike = () => fetchData({
        endpoint: `posts/${postData.id}/like`,
        method: 'PUT',
        auth, setAuth,
        thenFunc: responseData => setPostData(prevPostData => ({
            ...prevPostData,
            liked: responseData.liked,
            likes_count: responseData.likes_count
        }))
    });

    const onComment = () => {
        if (newComment.trim() === '')
            return;

        setLoanding(true);
        fetchData({
            endpoint: `posts/${postData.id}/comment`,
            method: 'POST',
            auth, setAuth,
            requestData: { 'text_content': newComment },
            thenFunc: reload,
            finallyFunc: () => {
                setNewComment('');
                setLoanding(false);
            }
        });
    };

    const onShare = () => {};

    const heartColor = postData.liked ? '#dd3333' : '#555';

    const onKeyDownComment = event => {
        if (event.key === 'Enter')
            onComment();
        else if (event.key === 'Escape')
            event.target.blur();
    };

    return loanding ? <Loanding /> : (<>
        <article className={ styles.root }>
            <Head
                authorFullname={ postData.author_fullname }
                authorUsername={ postData.author_username }
                authorAvatarUrl={ postData.author_avatar_url }
                postedTime={ postData.posted_time }
                key={ postData.id }
            />
            <div className={ styles.body }>
                { postData.text_content }
                <Gallery
                    images={ postData.images }
                    authorFullname={ postData.author_fullname }
                />
            </div>
            <div className={ styles.foot }>
                <Button
                    className='text'
                    onClick = { onLike }
                >
                    <span style={{ color: heartColor }}>
                        { postData.likes_count }
                    </span>
                    <svg width='20px' height='20px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g strokeWidth='0'></g><g strokeLinecap='round' strokeLinejoin='round'></g><g> <path d='M8.96173 18.9109L9.42605 18.3219L8.96173 18.9109ZM12 5.50063L11.4596 6.02073C11.601 6.16763 11.7961 6.25063 12 6.25063C12.2039 6.25063 12.399 6.16763 12.5404 6.02073L12 5.50063ZM15.0383 18.9109L15.5026 19.4999L15.0383 18.9109ZM9.42605 18.3219C7.91039 17.1271 6.25307 15.9603 4.93829 14.4798C3.64922 13.0282 2.75 11.3345 2.75 9.1371H1.25C1.25 11.8026 2.3605 13.8361 3.81672 15.4758C5.24723 17.0866 7.07077 18.3752 8.49742 19.4999L9.42605 18.3219ZM2.75 9.1371C2.75 6.98623 3.96537 5.18252 5.62436 4.42419C7.23607 3.68748 9.40166 3.88258 11.4596 6.02073L12.5404 4.98053C10.0985 2.44352 7.26409 2.02539 5.00076 3.05996C2.78471 4.07292 1.25 6.42503 1.25 9.1371H2.75ZM8.49742 19.4999C9.00965 19.9037 9.55954 20.3343 10.1168 20.6599C10.6739 20.9854 11.3096 21.25 12 21.25V19.75C11.6904 19.75 11.3261 19.6293 10.8736 19.3648C10.4213 19.1005 9.95208 18.7366 9.42605 18.3219L8.49742 19.4999ZM15.5026 19.4999C16.9292 18.3752 18.7528 17.0866 20.1833 15.4758C21.6395 13.8361 22.75 11.8026 22.75 9.1371H21.25C21.25 11.3345 20.3508 13.0282 19.0617 14.4798C17.7469 15.9603 16.0896 17.1271 14.574 18.3219L15.5026 19.4999ZM22.75 9.1371C22.75 6.42503 21.2153 4.07292 18.9992 3.05996C16.7359 2.02539 13.9015 2.44352 11.4596 4.98053L12.5404 6.02073C14.5983 3.88258 16.7639 3.68748 18.3756 4.42419C20.0346 5.18252 21.25 6.98623 21.25 9.1371H22.75ZM14.574 18.3219C14.0479 18.7366 13.5787 19.1005 13.1264 19.3648C12.6739 19.6293 12.3096 19.75 12 19.75V21.25C12.6904 21.25 13.3261 20.9854 13.8832 20.6599C14.4405 20.3343 14.9903 19.9037 15.5026 19.4999L14.574 18.3219Z' fill={ heartColor }></path> </g></svg>
                </Button>
                
                <Button
                    className='text'
                    onClick = { onShare }
                >
                    <svg width='20px' height='20px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g strokeWidth='0'></g><g strokeLinecap='round' strokeLinejoin='round'></g><g> <path d='M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195' stroke='#555' strokeWidth='1.5' strokeLinecap='round'></path> <path d='M12 15L12 2M12 2L15 5.5M12 2L9 5.5' stroke='#555' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'></path> </g></svg>
                </Button>
            </div>
        </article>

        <article className={ styles.root }>
            {
                postData.comments.map(comment =>
                    <Comment
                        comment={ comment }
                        key={ comment.id }
                    />
                )
            }
        </article>

        <TextField
            id='comment-field'
            ref={ commentFieldRef }
            inputPlaceholder='Your comment'
            style={{
                position: 'sticky',
                bottom: '15px',
                backgroundColor: 'white'
            }}
            onChange={ event => setNewComment(event.target.value) }
            onKeyDown={ onKeyDownComment }
        >
            <Button
                className='icon'
                onClick={ onComment }
            >
                <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g strokeWidth="0"></g><g strokeLinecap="round" strokeLinejoin="round"></g><g> <path d="M4.49746 20.835L21.0072 13.4725C22.3309 12.8822 22.3309 11.1178 21.0072 10.5275L4.49746 3.16496C3.00163 2.49789 1.45006 3.97914 2.19099 5.36689L5.34302 11.2706C5.58817 11.7298 5.58818 12.2702 5.34302 12.7294L2.19099 18.6331C1.45007 20.0209 3.00163 21.5021 4.49746 20.835Z" stroke="#333" strokeWidth="1.5"></path> </g></svg>
            </Button>
        </TextField>
    </>);
}


function Head(props) {
    return (
        <Link to={ `/users/${props.authorUsername}` } >
            <div className={ styles.head }>
                <Avatar
                    src={ props.authorAvatarUrl ? props.authorAvatarUrl : 'https://i.pinimg.com/736x/b2/59/ef/b259ef62aa2753a5fb8a403250ed8efd.jpg' }
                    alt={ `avatar of ${props.authorFullname}` }
                    size={ props.size }
                />
                <div className={ styles.right }>
                    <span className={ styles.info }>
                        <span className={ styles.fullname }>
                            { props.authorFullname }
                        </span>
                        <span>@{ props.authorUsername }</span>
                        <span>
                            { sincePosted(new Date().getTime() - new Date(props.postedTime).getTime()) }
                        </span>
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default PostPage;