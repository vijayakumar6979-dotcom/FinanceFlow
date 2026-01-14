import { useEffect } from 'react';

export function useKeyPress(targetKey: string, handler: (event: KeyboardEvent) => void) {
    useEffect(() => {
        const downHandler = (event: KeyboardEvent) => {
            if (event.key === targetKey) {
                handler(event);
            }
        };

        window.addEventListener('keydown', downHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
        };
    }, [targetKey, handler]);
}
