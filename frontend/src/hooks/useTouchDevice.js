import { useEffect, useState } from 'react';

export default function useTouchDevice() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const touchCapable = 'ontouchstart' in window
            || navigator.maxTouchPoints > 0
            || navigator.msMaxTouchPoints > 0;

        setIsTouchDevice(Boolean(touchCapable));
    }, []);

    return isTouchDevice;
}
