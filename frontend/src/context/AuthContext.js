import { createContext, useEffect, useState, useContext } from 'react';
import {
    setToken as setApiToken,
    fetchProfile,
    refreshAuthToken,
    logoutUser as logoutRequest,
} from '../utils/api';

const AuthContext = createContext();

const isUnauthorizedError = error => error?.response?.status === 401;
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

const setClientCookie = (name, value, maxAge = AUTH_COOKIE_MAX_AGE) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`;
};

const clearClientCookie = name => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

const getInitialAuth = () => {
    if (typeof window === 'undefined') return { user: null, token: null };
    const storedUser = localStorage.getItem('kalossUser');
    const storedToken = localStorage.getItem('kalossToken');
    let parsedUser = null;

    if (storedUser) {
        try {
            parsedUser = JSON.parse(storedUser);
        } catch (error) {
            localStorage.removeItem('kalossUser');
        }
    }

    return {
        user: parsedUser,
        token: storedToken || null,
    };
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [hydrated, setHydrated] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    useEffect(() => {
        let active = true;

        const bootstrapAuth = async () => {
            const initialAuth = getInitialAuth();

            if (initialAuth.token) {
                setApiToken(initialAuth.token);
            }

            if (active) {
                setUser(initialAuth.user);
                setToken(initialAuth.token);
            }

            try {
                const { data } = await refreshAuthToken();
                if (!active) return;
                setUser(data.user);
                setToken(data.token);
            } catch (error) {
                if (!active) return;

                if (!initialAuth.token || isUnauthorizedError(error)) {
                    setUser(null);
                    setToken(null);
                }
            } finally {
                if (active) {
                    setHydrated(true);
                }
            }
        };

        bootstrapAuth();

        return () => {
            active = false;
        };
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined' || !hydrated) return;

        if (user) localStorage.setItem('kalossUser', JSON.stringify(user));
        else localStorage.removeItem('kalossUser');

        if (token) {
            localStorage.setItem('kalossToken', token);
            setApiToken(token);
            setClientCookie('kalossToken', token);
        } else {
            localStorage.removeItem('kalossToken');
            setApiToken(null);
            clearClientCookie('kalossToken');
        }

        if (user?.role) {
            setClientCookie('kalossRole', user.role);
        } else {
            clearClientCookie('kalossRole');
        }
    }, [user, token, hydrated]);

    const login = authData => {
        if (authData.user) setUser(authData.user);
        if (authData.token) setToken(authData.token);
    };

    const refreshProfile = async () => {
        if (!token) return null;
        setLoadingProfile(true);
        try {
            const { data } = await fetchProfile();
            setUser(data);
            return data;
        } catch (error) {
            if (isUnauthorizedError(error)) {
                setUser(null);
                setToken(null);
                return null;
            }

            throw error;
        } finally {
            setLoadingProfile(false);
        }
    };

    const logout = async () => {
        try {
            await logoutRequest();
        } catch (error) {
            // Local logout should still complete even if the API call fails.
        }
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            logout,
            hydrated,
            loadingProfile,
            refreshProfile,
            setUser,
        }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
