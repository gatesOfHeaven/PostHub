import { forwardRef } from 'react';
import styles from './style_modules/TextField.module.css';

const TextField = forwardRef((props, ref) =>
    <label
        htmlFor={ props.id }
        className={ styles.root }
        style={ props.style }
    >
        <span>{ props.placeholder }</span>
        <input
            id={ props.id }
            type={ props.type ? props.type : 'text' }
            placeholder={ props.inputPlaceholder }
            ref={ ref }
            onChange={ props.onChange }
            onKeyDown={ props.onKeyDown }
        />
        { props.children }
    </label>
);

export default TextField;