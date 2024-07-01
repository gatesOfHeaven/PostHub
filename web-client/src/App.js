import Header from './widgets/Header';
import Sidebar from './widgets/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from './app/AuthProvider';
import FullscreenMediaProvider, { useFullscreenMedia } from './app/FullscreenMediaProvider';
import SignPage from './pages/Sign/SignPage';
import HomePage from './pages/Home/HomePage';
import NotFoundPage from './pages/NotFound/NotFoundPage';
import FullscreenMediaLayout from './widgets/FullscreenMediaLayout';
import authSession from './entities/AuthSession';
import PostPage from './pages/Post/PostPage';

function App() {
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        if (!auth && authSession.hasPayload())
            setAuth(authSession.get());
        else if (auth)
            authSession.setPayload(auth);
        else
            authSession.signOut();
    }, [auth, setAuth]);

    return !auth ? <SignPage /> : (
        <FullscreenMediaProvider>
            <Authorized />
        </FullscreenMediaProvider>
    );
}


function Authorized() {
    const { fullscreenMedia } = useFullscreenMedia();

    const [tab, setTab] = useState('home');
    const [sidebarShown, setSidebarShown] = useState(true);
    const pageRef = useRef(null); 
    
    const computeStyle = window.innerWidth <= 700 && sidebarShown ? 'page-blured' : '';
    const onBurger = () => setSidebarShown(!sidebarShown);

    useEffect(() => {
        if (window.innerWidth <= 700)
            setSidebarShown(false);
    }, [setSidebarShown]);

    return (
        <Router>
            { fullscreenMedia !== undefined ? <FullscreenMediaLayout /> : null }
            
            <Header onBurger={ onBurger }>
                { tab.replace(tab[0], tab[0].toUpperCase()) }
            </Header>

            <section id='non-header'>
                <Sidebar
                    shown={ sidebarShown }
                    setTab={ setTab }
                />

                <section id='non-sidebar'>
                    <section
                        id='page'
                        ref={ pageRef }
                        className={ computeStyle }
                        onClick={ window.innerWidth <= 700 && sidebarShown ? onBurger : null }
                    >
                        <Routes>
                            <Route path='/' element={ <HomePage /> } />
                            <Route path='/posts/:id' element={ <PostPage /> } />
                            <Route path='*' element={ <NotFoundPage /> } />
                        </Routes>
                    </section>
                </section>
            </section>
        </Router>
    );
}

export default App;
