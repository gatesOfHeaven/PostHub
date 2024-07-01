import styles from './style_modules/UploadPost.module.css';
import { useAuth } from '../app/AuthProvider';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { useState } from 'react'
import useFetch from '../app/useFetch';

function UploadPost({ setCurrentPage }) {
    const { auth, setAuth } = useAuth();
    const fetchData = useFetch();
    const [draftPost, setDraftPost] = useState('');

    const onKeyDown = event => {
        if (event.key === 'Escape')
            event.target.blur();
        if (event.ctrlKey && event.key === 'Enter')
            uploadPost();
    }

    const uploadImage = () => {};
    const uploadPost = () => fetchData({
        endpoint: 'posts/new',
        method: 'POST',
        auth, setAuth,
        requestData: {
            text_content: draftPost.trim(),
            images: []
        },
        finallyFunc: () => {
            setDraftPost('');
            setCurrentPage(1);
        }
    });

    return (
        <label
            className={ styles.root }
            htmlFor={ styles.textarea }
        >
            <Link to='/users/me'>
                <div className={ styles.avatar }>
                    {
                        auth.avatarUrl ? (
                            <img
                                src={ auth.avatarUrl }
                                alt={ auth.username }
                            />
                        ) : 'me'
                    }
                </div>
            </Link>

            <div className={ styles.interface }>
                <textarea
                    id={ styles.textarea }
                    rows='2'
                    placeholder='Something new?'
                    defaultValue={ draftPost }
                    onChange={ event => setDraftPost(event.target.value) }
                    onKeyDown={ onKeyDown }
                    onFocus={ event => event.target.style.height = '200px' }
                    onBlur={ event => event.target.style.height = '45px' }
                />

                {
                    draftPost !== '' ? (
                        <div className={ styles.interaction }>
                            <Button
                                className='text'
                                onClick={ uploadImage }
                            >
                                Upload Image
                            </Button>
                            <Button onClick={ uploadPost }>
                                Post
                            </Button>
                        </div>
                    ) : null
                }
            </div>
        </label>
    );
}

export default UploadPost