import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

interface User {
    id: string;
    username: string;
    email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('https://white-board-d298.onrender.com/user/log-in', { username, password });
            setUser({ id: response.data.id, username, email: response.data.email });
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (error) {
            console.error('Login failed', error);
            throw new Error('Login failed');
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            await axios.post('https://white-board-d298.onrender.com/user/register', { username, email, password });
            navigate('/login');
        } catch (error) {
            console.error('Registration failed', error);
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            axios.get('https://white-board-d298.onrender.com/user', { headers: { Authorization: `Bearer ${storedToken}` } })
                .then(response => {
                    setUser({ id: response.data.id, username: response.data.username, email: response.data.email });
                    setToken(storedToken);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
