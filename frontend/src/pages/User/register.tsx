import React, { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext'; 
import { Link } from 'react-router-dom';

const Register: React.FC = () => {
    const { register } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await register(username, email, password);
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
            <div className="p-4 p-md-5 bg-secondary rounded shadow-sm w-100 w-md-50">
                <h2 className="text-center text-white mb-4">Register</h2>
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
                        <label htmlFor="email" className="form-label text-white">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
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
                        className="btn btn-success w-100"
                    >
                        Register
                    </button>
                </form>
                <div className="text-center mt-3">
                    <Link to="/login" className="text-light">
                        Already have an account? Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
