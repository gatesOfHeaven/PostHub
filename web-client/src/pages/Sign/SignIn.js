import { useRef } from 'react';
import styles from './Sign.module.css';
import Button from '../../components/Button';
import TextField from '../../components/TextField';
import { useAuth } from '../../app/AuthProvider';

function SignIn() {
    const { setAuth } = useAuth();
    const usernameTextFieldRef = useRef(null);
    const passwordTextFieldRef = useRef(null);
    const usernameErrorRef = useRef(null);
    const passwordErrorRef = useRef(null);
    
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


    const onSignIn = event => {
        event.preventDefault();
        const un = usernameTextFieldRef.current.value.trim();
        const pw = passwordTextFieldRef.current.value.trim();

        if (un.length === 0)
            usernameErrorRef.current.textContent = 'This field is required';
        if (pw.length === 0)
            passwordErrorRef.current.textContent = 'This field is required';

        if (
            !un.match(/^[A-Za-z0-9_-]+$/) ||
            !pw.match(/^[\x21-\x7E]+$/) ||
            un.length < 3 ||
            pw.length < 5 ||
            un.length > 15 ||
            pw.length > 15
        ) return;

        let token;
        fetch ('http://localhost:8000/auth/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                username: un,
                password: pw
            })
        })
            .then(response => {
                if (!response.ok) {
                    usernameErrorRef.current.textContent = 'Wrong username or password';
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
                id: data['id'],
                username: data.username,
                fullname: data.fullname,
                token
            }))
            .catch(console.error);
    };

    return (
        <form onSubmit={ onSignIn }>
            <h1>Sign In</h1>

            <div className={ styles.inputGroup }>
                <TextField
                    id='username-textfield'
                    ref={ usernameTextFieldRef }
                    placeholder='Email or Username *'
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
                >
                    <Button
                        className='icon'
                        onTouch={ () => passwordTextFieldRef.current.type = 'text' }
                        onUntouch={ () => passwordTextFieldRef.current.type = 'password' }
                    >
                        <svg width='21px' height='21px' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'><g strokeWidth='0'></g><g strokeLinecap='round' strokeLinejoin='round'></g> <g><path d='M9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z' fill='#777'></path> <path fillRule='evenodd' clipRule='evenodd' d='M2 12C2 13.6394 2.42496 14.1915 3.27489 15.2957C4.97196 17.5004 7.81811 20 12 20C16.1819 20 19.028 17.5004 20.7251 15.2957C21.575 14.1915 22 13.6394 22 12C22 10.3606 21.575 9.80853 20.7251 8.70433C19.028 6.49956 16.1819 4 12 4C7.81811 4 4.97196 6.49956 3.27489 8.70433C2.42496 9.80853 2 10.3606 2 12ZM12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25Z' fill='#777'></path> </g></svg>
                    </Button>
                </TextField>
                <span
                    ref={ passwordErrorRef }
                    className={ styles.error }
                ></span>
            </div>

            <div className={ styles.buttonGroup }>
                <Button
                    className='text'
                >
                    Forgot Password
                </Button>
                <Button type='submit'>
                    Sign In
                </Button>
            </div>
        </form>
    );
}

export default SignIn;