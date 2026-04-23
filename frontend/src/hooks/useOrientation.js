import useMediaQuery from './useMediaQuery';

export default function useOrientation() {
    const isPortrait = useMediaQuery('(orientation: portrait)');

    return isPortrait ? 'portrait' : 'landscape';
}
