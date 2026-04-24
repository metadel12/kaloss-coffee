import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
    const { user, logout } = useAuth();
    const { getCartItemsCount } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);
    const [coffeeMenuOpen, setCoffeeMenuOpen] = useState(false);
    const closeMenu = () => {
        setMenuOpen(false);
        setCoffeeMenuOpen(false);
    };
    const handleLogout = () => {
        closeMenu();
        logout();
    };

    const navContent = (
        <>
            <div className={`nav-dropdown ${coffeeMenuOpen ? 'open' : ''}`}>
                <button
                    type="button"
                    className="nav-dropdown-trigger"
                    aria-expanded={coffeeMenuOpen}
                    aria-controls="our-coffee-menu"
                    onClick={() => setCoffeeMenuOpen(previous => !previous)}
                >
                    Our Coffee
                    <span className="nav-dropdown-caret" aria-hidden="true">{coffeeMenuOpen ? 'x' : '+'}</span>
                </button>

                <div id="our-coffee-menu" className="nav-dropdown-menu">
                    <Link href="/gifts" onClick={closeMenu}>Gift</Link>
                    <Link href="/wholesale" onClick={closeMenu}>Wholesale</Link>
                    <Link href="/limited-edition" onClick={closeMenu}>Limited Edition</Link>
                </div>
            </div>
            <Link href="/about" onClick={closeMenu}>About</Link>
            <Link href="/contact" onClick={closeMenu}>Contact</Link>
            <Link href="/compare" onClick={closeMenu}>Compare</Link>
            <Link href="/cart" className="header-cart-link" onClick={closeMenu}>Cart ({getCartItemsCount()})</Link>
            {user ? (
                <div className="auth-controls">
                    <Link href="/profile" onClick={closeMenu}>Selam, {user.fullName || user.name}</Link>
                    {['admin', 'super_admin'].includes(user.role) && <Link href="/admin/dashboard" onClick={closeMenu}>Admin</Link>}
                    <button type="button" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div className="auth-links">
                    <Link href="/login" className="header-auth-link login-link" onClick={closeMenu}>Login</Link>
                    <Link href="/register" className="header-auth-link register-link" onClick={closeMenu}>Sign Up</Link>
                </div>
            )}
        </>
    );

    return (
        <header className="site-header kaloss-header">
            <div className="kaloss-brand">
                <Link href="/" onClick={closeMenu}>Kaloss Coffee</Link>
                <span>From Ethiopian Highlands to Your Cup</span>
            </div>

            <button
                type="button"
                className="menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="site-navigation"
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                onClick={() => setMenuOpen(previous => !previous)}
            >
                <span />
                <span />
                <span />
            </button>

            <nav id="site-navigation" className={`kaloss-nav ${menuOpen ? 'open' : ''}`}>
                {navContent}
            </nav>
        </header>
    );
}
