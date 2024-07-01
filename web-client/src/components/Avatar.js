import styles from './style_modules/Avatar.module.css';

function Avatar(props) {
    const size = props.size ? props.size : '50px'
    return (
        <div
            className={ styles.root }
            style={{ minWidth: size, height: size }}
        >
            <img
                src={ props.src }
                alt={ props.alt }
            />
        </div>
    );
}

export default Avatar;