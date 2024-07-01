import Image from '../components/Image';
import styles from './style_modules/Gallery.module.css';

function Gallery({ images , authorFullname}) {
    return (
        <div className={ styles.root }>
            {
                images.map(image =>
                    <Image
                        url={ image.url }
                        title={ `${authorFullname}'s img` }
                        maxWidth='100%'
                        maxHeight='200px'
                        key={ image.id }
                    />
                )
            }
        </div>
    );
}

export default Gallery;