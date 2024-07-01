import { createContext, useContext, useState } from 'react';

const FullscreenMediaContext = createContext();

function FullscreenMediaProvider({ children }) {
    const [fullscreenMedia, setFullscreenMedia] = useState();

    return (
        <FullscreenMediaContext.Provider value={{ fullscreenMedia, setFullscreenMedia }}>
            { children }
        </FullscreenMediaContext.Provider>
    );
}

export const useFullscreenMedia = () => useContext(FullscreenMediaContext);

export default FullscreenMediaProvider;