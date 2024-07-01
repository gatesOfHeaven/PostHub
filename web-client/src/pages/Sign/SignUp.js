import { useRef } from 'react';
import styles from './Sign.module.css';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAuth } from '../../app/AuthProvider';

function SignUp() {
    const { setAuth } = useAuth();
    
    // const emailTextFieldRef = useRef(null);
    const fullnameTextFieldRef = useRef(null);
    const usernameTextFieldRef = useRef(null);
    const passwordTextFieldRef = useRef(null);
    const repeatePasswordTextFieldRef = useRef(null);
    // const emailErrorRef = useRef(null);
    const fullnameErrorRef = useRef(null);
    const usernameErrorRef = useRef(null);
    const passwordErrorRef = useRef(null);
    const repeatePasswordErrorRef = useRef(null);
    
    const onFullnameChange = () => {
        const fn = fullnameTextFieldRef.current.value.trim();
        fullnameErrorRef.current.textContent = (
            fn.length === 0 ? '' :
            !fn.match(/^[A-Za-z0-9 _-]+$/) ? 'Fullname has an invalid symbols' :
            fn.length < 3 ? 'Fullname is too short' :
            fn.length > 25 ? 'Fullname is too long' :
            ''
        );
    };
    
    const onUsernameChange = () => {
        const un = usernameTextFieldRef.current.value.trim();
        usernameErrorRef.current.textContent = (
            un.length === 0 ? '' :
            !un.match(/^[A-Za-z0-9_-]+$/) ? 'Username has an invalid symbols' :
            un.length < 3 ? 'Username is too short' :
            un.length > 15 ? 'Username is too long' :
            ''
        );
    };

    const onPasswordChange = () => {
        const pw = passwordTextFieldRef.current.value.trim();
        passwordErrorRef.current.textContent = (
            pw.length === 0 ? '' :
            !pw.match(/^[\x21-\x7E]+$/) ? 'Password has an invalid symbols' :
            pw.length < 5 ? 'Password is too short' :
            pw.length > 15 ? 'Password is too long' :
            ''
        );
    };


    const onSignUp = event => {
        event.preventDefault();
        const un = usernameTextFieldRef.current.value.trim();
        const fn = fullnameTextFieldRef.current.value.trim() !== '' ? fullnameTextFieldRef.current.value.trim() : un;
        const pw = passwordTextFieldRef.current.value;
        const rpw = repeatePasswordTextFieldRef.current.value;

        if (un.length === 0)
            usernameErrorRef.current.textContent = 'This field is required';
        if (pw.length === 0)
            passwordErrorRef.current.textContent = 'This field is required';
        if (rpw.length === 0)
            repeatePasswordErrorRef.current.textContent = 'This field is required';
        if (pw !== rpw)
            repeatePasswordErrorRef.current.textContent = 'Passwords doesn\'t match';

        if (
            !un.match(/^[A-Za-z0-9_-]+$/) ||
            !pw.match(/^[\x21-\x7E]+$/) ||
            un.length < 3 ||
            pw.length < 5 ||
            un.length > 15 ||
            pw.length > 15 ||
            pw !== rpw
        ) return;

        let token;
        fetch ('http://localhost:8000/auth/sign-up', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                username: un,
                fullname: fn,
                password: pw
            })
        })
            .then(response => {
                if (!response.ok) {
                    usernameErrorRef.current.textContent = 'Username already used';
                    return;
                } else if (response.headers.has('Authorization'))
                    token = response.headers.get('Authorization').replace('Bearer ', '');
                else {
                    console.log('Authorization header not found in response');
                    return;
                }

                return response.json();
            })
            .then(data => setAuth({
                id: data.id,
                username: data.username,
                fullname: data.fullname,
                token
            }))
            .catch(console.error);
    };

    return (
        <form onSubmit={ onSignUp }>
            <h1>Sign Up</h1>

            {/* <div className={ styles.inputGroup }>
                <TextField
                    id='email-textfield'
                    type='email'
                    ref={ emailTextFieldRef }
                    placeholder='Email *'
                />
                <span
                    ref={ emailErrorRef }
                    className={ styles.error }
                ></span>
            </div> */}

            <div className={ styles.inputGroup }>
                <TextField
                    id='fullname-textfield'
                    ref={ fullnameTextFieldRef }
                    placeholder='Full Name'
                    onChange={ onFullnameChange }
                />
                <span
                    ref={ fullnameErrorRef }
                    className={ styles.error }
                ></span>
            </div>

            <div className={ styles.inputGroup }>
                <TextField
                    id='username-textfield'
                    ref={ usernameTextFieldRef }
                    placeholder='Username *'
                    onChange={ onUsernameChange }
                />
                <span
                    ref={ usernameErrorRef }
                    className={ styles.error }
                ></span>
            </div>

            <div className={ styles.inputGroup }>
                <TextField
                    id='password-textfield'
                    type='password'
                    ref={ passwordTextFieldRef }
                    placeholder='Password *'
                    onChange={ onPasswordChange }
                />
                <span
                    ref={ passwordErrorRef }
                    className={ styles.error }
                ></span>
            </div>

            <div className={ styles.inputGroup }>
                <TextField
                    id='repeate-password-textfield'
                    type='password'
                    ref={ repeatePasswordTextFieldRef }
                    placeholder='Repeate Password *'
                    onChange={ () => repeatePasswordErrorRef.current.textContent = '' }
                />
                <span
                    ref={ repeatePasswordErrorRef }
                    className={ styles.error }
                ></span>
            </div>

            <Button
                type='submit'
                styles={{ width: '100%' }}
            >
                Sign Up
            </Button>
        </form>
    );
}

export default SignUp;