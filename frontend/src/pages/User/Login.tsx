import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await login(username, password);
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
            <div className="p-4 p-md-5 bg-secondary rounded shadow-sm w-100 w-md-50">
                <h2 className="text-center text-white mb-4">Log In</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-white">Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-white">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Log In
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/register" className="text-light">
                        Don't have an account? Sign up here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
