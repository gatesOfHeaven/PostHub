import { useFullscreenMedia } from '../app/FullscreenMediaProvider';
import styles from './style_modules/FullscreenMediaLayout.module.css';

function FullscreenMediaLayout() {
    const { fullscreenMedia, setFullscreenMedia } = useFullscreenMedia();
    const exit = () => setFullscreenMedia(undefined);
    const onEscape = event => {
        if (event.key === 'Escape')
            exit();
        document.removeEventListener('keydown', onEscape);
    };
    document.addEventListener('keydown', onEscape);


    return (
        <section
            className={ styles.root }
            onClick={ exit }
        >
            <img
                src={ fullscreenMedia.url }
                alt={ fullscreenMedia.title }
                onClick={ () => {} }
            />
        </section>
    );
}

export default FullscreenMediaLayout;