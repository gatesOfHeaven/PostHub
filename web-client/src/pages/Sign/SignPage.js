import { useState } from 'react';
import styles from './Sign.module.css';
import Button from '../../components/Button';
import SignUp from './SignUp';
import SignIn from './SignIn';

function SignPage() {
    const [firstTime, setFirstTime] = useState(false);

    return (
        <main className={ styles.root }>
            <article className={ styles.left }>
                <h1>{ firstTime ? 'Welcome!' : 'Welcome back!' }</h1>
                <Button
                    className='text'
                    onClick={ () => setFirstTime(!firstTime) }
                >
                    { firstTime ? 'Already has an account?' : 'First time?' }
                </Button>
            </article>

            <article className={ styles.right }>
                <div className={ styles.signContainer }>
                    { firstTime ? <SignUp /> : <SignIn /> }
                </div>
            </article>
        </main>
    );
}

export default SignPage;