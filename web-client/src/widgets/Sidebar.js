import styles from './style_modules/Sidebar.module.css';
import Button from '../components/Button';
import { useAuth } from '../app/AuthProvider';
import authSession from '../entities/AuthSession';
import { Link } from 'react-router-dom';

function Sidebar(props) {
    const { auth, setAuth } = useAuth();
    const computeStyle = styles.root + (
        !props.shown ? ' ' + styles.hidden : ''
    );

    const onSignOut = () => {
        authSession.signOut();
        setAuth(undefined);
    };

    const tabs = [
        { url: '/', tab: 'Home', children: 'Home' },
        { url: '/messages', tab: 'Messages', children: 'Messages' },
        { url: '/settings', tab: 'Settings', children: 'Settings' }
    ];

    return (
        <aside className={ computeStyle }>
            <div className={ styles.top }>
                <div className={ styles.profile }>
                    <div className={ styles.avatar }>me</div>
                    <div className={ styles.names }>
                        <span className={ styles.fullname }>
                            { auth.fullname }
                        </span>
                        <span className={ styles.username }>
                            @{ auth.username }
                        </span>
                    </div>
                </div>
                {
                    tabs.map(tab =>
                        <SidebarButton
                            url={ tab.url }
                            key={ tab.url }
                            tab={ tab.tab }
                            setTab={ props.setTab }
                        >
                            { tab.children }
                        </SidebarButton>
                    )
                }
            </div>

            <div className={ styles.bottom }>
                <Button
                    className='danger'
                    onClick={ onSignOut }
                >
                    Sign Out
                </Button>
            </div>
        </aside>
    );
}


function SidebarButton({ url, tab, setTab, children }) {
    return (
        <Link to={ url }>
            <Button
                className='text'
                onClick={ () => setTab(tab) }
                style={{ width: '100%' }}
            >
                { children }
            </Button>
        </Link>
    );
}

export default Sidebar;