import styles from './style_modules/Button.module.css'

function Button(props) {
    const type = props.className ? props.className : 'default';

    return (
        <button
            className={ styles.root + ' ' + styles[type] }
            onClick={ props.onClick }
            type={ props.type ? props.type : 'button' }
            onMouseDown={ props.onTouch }
            onTouchStart={ props.onTouch }
            onMouseUp={ props.onUntouch }
            onTouchEnd={ props.onUntouch }
            style={ props.style }
        >
            { props.children }
        </button>
    )
}

export default Button;