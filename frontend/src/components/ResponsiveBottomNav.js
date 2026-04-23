import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navItems = [
    { href: '/', label: 'Home', icon: '⌂' },
    { href: '/products', label: 'Shop', icon: '◫' },
    { href: '/cart', label: 'Cart', icon: '◍' },
    { href: '/profile', label: 'Profile', icon: '◌' },
];

export default function ResponsiveBottomNav() {
    const router = useRouter();
    const { user } = useAuth();
    const { getCartItemsCount } = useCart();

    return (
        <nav className="mobile-bottom-nav mobile-only" aria-label="Mobile quick navigation">
            {navItems.map(item => {
                const isActive = item.href === '/'
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href);
                const badge = item.href === '/cart' ? getCartItemsCount() : null;
                const href = item.href === '/profile' && !user ? '/login' : item.href;

                return (
                    <Link key={item.href} href={href} className={isActive ? 'active' : ''}>
                        <span className="mobile-bottom-nav-icon" aria-hidden="true">{item.icon}</span>
                        <span>{item.label}</span>
                        {badge ? <small>{badge}</small> : null}
                    </Link>
                );
            })}
        </nav>
    );
}
