import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div className="container text-center mt-5">
            <h1 className="display-4 mb-4">White Board App</h1>
            <div className="d-flex justify-content-center gap-3">
                <Link className="btn btn-primary" to="/dashboard">Go to Dashboard</Link>
                <Link className="btn btn-secondary" to="/login">Login</Link>
            </div>
        </div>
    );
};

export default Home;
