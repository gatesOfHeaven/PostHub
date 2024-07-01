import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import styles from './NotFound.module.css';

function NotFoundPage() {
    return (
        <div className={ styles.root }>
            <span className={ styles.status }>
                404
            </span>
            <span className={ styles.title }>
                Page Not Found
            </span>
            <Link to='/'>
                <Button className='text'>
                    Home
                </Button>
            </Link>
        </div>
    );
}

export default NotFoundPage;