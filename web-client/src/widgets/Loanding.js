import { useEffect, useState } from 'react';

function Loanding() {
    const [dots, setDots] = useState('');
    useEffect(() => {
        const interval = setInterval(() => {
          setDots(prevDots => prevDots.length < 3 ? prevDots + '.' : '');
        }, 500);
    
        return () => clearInterval(interval);
    }, []);

    return (
        <span style={{
            display: 'flex',
            alignSelf: 'center',
            fontSize: '25px',
            color: '#555'
        }}
        >
            Loanding{dots}
        </span>
    );
}

export default Loanding;