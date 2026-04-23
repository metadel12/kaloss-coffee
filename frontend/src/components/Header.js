import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceType from '../hooks/useDeviceType';
import useOrientation from '../hooks/useOrientation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const coffeeLinks = [
    { href: '/products', label: 'All Coffees' },
    { href: '/products/yirgacheffe-g1-washed', label: 'Yirgacheffe' },
    { href: '/products/sidama-natural', label: 'Sidama' },
    { href: '/products/guji-g1', label: 'Guji' },
    { href: '/products/harrar-longberry', label: 'Harrar' },
    { href: '/products/limu-g2', label: 'Limu' },
];

export default function Header() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { getCartItemsCount } = useCart();
    const deviceType = useDeviceType();
    const orientation = useOrientation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [coffeeOpen, setCoffeeOpen] = useState(false);
    const headerRef = useRef(null);
    const drawerRef = useRef(null);
    const closeButtonRef = useRef(null);
    const closeMenu = () => setMenuOpen(false);
    const isDesktop = deviceType === 'desktop';
    const isDrawerDevice = deviceType === 'mobile' || deviceType === 'tablet';
    const currentPath = router.pathname;

    const isCurrentPath = href => href === '/'
        ? currentPath === href
        : currentPath === href || currentPath.startsWith(`${href}/`);

    useEffect(() => {
        if (isDesktop) {
            setMenuOpen(false);
        }
    }, [isDesktop]);

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === 'Escape' && menuOpen) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [menuOpen]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const handleShortcut = event => {
            if (event.altKey && event.key.toLowerCase() === 's') {
                event.preventDefault();
                const searchTarget = document.querySelector('input[type="search"], input[name="search"], input[placeholder*="Search"]');
                searchTarget?.focus();
            }
        };

        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return undefined;
        }

        document.body.classList.toggle('menu-open', menuOpen && isDrawerDevice);

        return () => {
            document.body.classList.remove('menu-open');
        };
    }, [isDrawerDevice, menuOpen]);

    useEffect(() => {
        if (!isDrawerDevice || !menuOpen) {
            return undefined;
        }

        closeButtonRef.current?.focus();

        const handleTrap = event => {
            if (event.key !== 'Tab' || !drawerRef.current) {
                return;
            }

            const focusable = drawerRef.current.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
            );

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleTrap);
        return () => document.removeEventListener('keydown', handleTrap);
    }, [isDrawerDevice, menuOpen]);

    useEffect(() => {
        if (currentPath.startsWith('/products')) {
            setCoffeeOpen(true);
        }
    }, [currentPath]);

    const handleLogout = () => {
        logout();
        closeMenu();
    };

    return (
        <header
            ref={headerRef}
            className={`site-header kaloss-header ${menuOpen ? 'menu-open' : ''}`}
            data-device={deviceType}
            data-orientation={orientation}
        >
            <div className="kaloss-brand">
                <Link href="/" onClick={closeMenu}>Kaloss Coffee</Link>
                <span>From Ethiopian Highlands to Your Cup</span>
            </div>

            <nav className="kaloss-nav-desktop desktop-nav" aria-label="Primary">
                <Link href="/products" className={isCurrentPath('/products') ? 'active' : ''}>Our Coffees</Link>
                <Link href="/limited-edition" className={isCurrentPath('/limited-edition') ? 'active' : ''}>Limited Edition</Link>
                <Link href="/gifts" className={isCurrentPath('/gifts') ? 'active' : ''}>Gift Sets</Link>
                <Link href="/wholesale" className={isCurrentPath('/wholesale') ? 'active' : ''}>Wholesale</Link>
                <Link href="/about" className={isCurrentPath('/about') ? 'active' : ''}>About</Link>
                <Link href="/contact" className={isCurrentPath('/contact') ? 'active' : ''}>Contact</Link>
                <Link href="/compare" className={isCurrentPath('/compare') ? 'active' : ''}>Compare</Link>
                <Link href="/cart" className={`header-cart-link ${isCurrentPath('/cart') ? 'active' : ''}`}>Cart ({getCartItemsCount()})</Link>
                {user ? (
                    <div className="auth-controls">
                        <Link href="/profile" className={isCurrentPath('/profile') ? 'active' : ''}>Selam, {user.fullName || user.name}</Link>
                        {['admin', 'super_admin'].includes(user.role) && <Link href="/admin/dashboard" className={isCurrentPath('/admin') ? 'active' : ''}>Admin</Link>}
                        <button type="button" onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="auth-links">
                        <Link href="/login" className={`header-auth-link login-link ${isCurrentPath('/login') ? 'active' : ''}`}>Login</Link>
                        <Link href="/register" className={`header-auth-link register-link ${isCurrentPath('/register') ? 'active' : ''}`}>Sign Up</Link>
                    </div>
                )}
            </nav>

            <button
                type="button"
                className={`menu-toggle ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(previous => !previous)}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
                <span className="menu-toggle-icon" aria-hidden="true">
                    <span className="menu-toggle-bar" />
                    <span className="menu-toggle-bar" />
                    <span className="menu-toggle-bar" />
                </span>
                <span className="menu-toggle-label">{menuOpen ? 'Close' : 'Menu'}</span>
            </button>

            {isDrawerDevice && (
                <>
                    <div
                        className={`menu-backdrop ${menuOpen ? 'open' : ''}`}
                        onClick={closeMenu}
                        aria-hidden="true"
                    />

                    <aside
                        id="mobile-navigation"
                        ref={drawerRef}
                        className={`kaloss-drawer ${menuOpen ? 'open' : ''}`}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                    >
                        <div className="kaloss-drawer-header">
                            <div className="kaloss-drawer-brand">
                                <span className="drawer-brand-mark">☕</span>
                                <div>
                                    <strong>Kaloss Coffee</strong>
                                    <span>Ethiopian craft, everyday ritual</span>
                                </div>
                            </div>
                            <button
                                ref={closeButtonRef}
                                type="button"
                                className="drawer-close-button"
                                onClick={closeMenu}
                                aria-label="Close menu"
                            >
                                <span aria-hidden="true">X</span>
                            </button>
                        </div>

                        <div className="drawer-user-card">
                            <div className="drawer-user-avatar" aria-hidden="true">{user ? '👤' : '☕'}</div>
                            {user ? (
                                <div className="drawer-user-copy">
                                    <strong>Selam, {user.fullName || user.name}</strong>
                                    <span>{user.email || 'Kaloss member'}</span>
                                    <div className="drawer-user-actions">
                                        <Link href="/profile" onClick={closeMenu}>Profile</Link>
                                        <button type="button" onClick={handleLogout}>Logout</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="drawer-user-copy">
                                    <strong>Welcome, Guest</strong>
                                    <span>Explore Ethiopian coffees and curated gift sets.</span>
                                    <div className="drawer-user-actions">
                                        <Link href="/login" onClick={closeMenu}>Login</Link>
                                        <Link href="/register" onClick={closeMenu}>Register</Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <nav className="kaloss-drawer-nav" aria-label="Mobile primary navigation">
                            <Link href="/" className={isCurrentPath('/') ? 'active' : ''} onClick={closeMenu}>Home</Link>

                            <div className={`drawer-accordion ${coffeeOpen ? 'open' : ''}`}>
                                <button
                                    type="button"
                                    className={`drawer-accordion-toggle ${isCurrentPath('/products') ? 'active' : ''}`}
                                    onClick={() => setCoffeeOpen(previous => !previous)}
                                    aria-expanded={coffeeOpen}
                                >
                                    <span>Our Coffees</span>
                                    <span className="drawer-accordion-icon" aria-hidden="true">{coffeeOpen ? '−' : '+'}</span>
                                </button>

                                <div className="drawer-submenu">
                                    {coffeeLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={currentPath === link.href ? 'active' : ''}
                                            onClick={closeMenu}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <Link href="/about" className={isCurrentPath('/about') ? 'active' : ''} onClick={closeMenu}>About Us</Link>
                            <Link href="/contact" className={isCurrentPath('/contact') ? 'active' : ''} onClick={closeMenu}>Contact</Link>
                            <Link href="/limited-edition" className={isCurrentPath('/limited-edition') ? 'active' : ''} onClick={closeMenu}>Limited Edition</Link>
                            <Link href="/gifts" className={isCurrentPath('/gifts') ? 'active' : ''} onClick={closeMenu}>Gift Sets</Link>
                            <Link href="/wholesale" className={isCurrentPath('/wholesale') ? 'active' : ''} onClick={closeMenu}>Wholesale</Link>
                            <Link href="/compare" className={isCurrentPath('/compare') ? 'active' : ''} onClick={closeMenu}>Compare</Link>
                            <Link href="/cart" className={isCurrentPath('/cart') ? 'active' : ''} onClick={closeMenu}>
                                Cart
                                <span className="drawer-link-badge">{getCartItemsCount()}</span>
                            </Link>
                            {user && ['admin', 'super_admin'].includes(user.role) ? (
                                <Link href="/admin/dashboard" className={isCurrentPath('/admin') ? 'active' : ''} onClick={closeMenu}>Admin</Link>
                            ) : null}
                        </nav>
                    </aside>
                </>
            )}
        </header>
    );
}
