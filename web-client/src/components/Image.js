import { useFullscreenMedia } from '../app/FullscreenMediaProvider';


function Image(props) {
    const { fullscreenMedia, setFullscreenMedia } = useFullscreenMedia();
    const openImage = () => {
        if (!fullscreenMedia)
            setFullscreenMedia({
                url: props.url,
                title: props.title
            });
    };

    return (
        <img
            src={ props.url }
            alt={ props.title }
            onClick={ openImage }
            style={{
                maxWidth: props.maxWidth,
                maxHeight: props.maxHeight,
                objectFit: 'contain',
                cursor: 'zoom-in'
            }}
        />
    );
}

export default Image;