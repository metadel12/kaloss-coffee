import useMediaQuery from './useMediaQuery';

export default function useDeviceType() {
    const isMobile = useMediaQuery('(max-width: 820px)');
    const isTablet = useMediaQuery('(min-width: 821px) and (max-width: 1024px)');

    if (isMobile) {
        return 'mobile';
    }

    if (isTablet) {
        return 'tablet';
    }

    return 'desktop';
}
