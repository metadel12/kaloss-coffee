import { useEffect, useState } from 'react';

export default function useMediaQuery(query) {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
            return undefined;
        }

        const mediaQuery = window.matchMedia(query);
        const onChange = event => setMatches(event.matches);

        setMatches(mediaQuery.matches);

        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', onChange);
            return () => mediaQuery.removeEventListener('change', onChange);
        }

        mediaQuery.addListener(onChange);
        return () => mediaQuery.removeListener(onChange);
    }, [query]);

    return matches;
}
