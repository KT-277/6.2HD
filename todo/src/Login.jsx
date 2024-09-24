import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { toast } from 'react-toastify';

function Login({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register

    const handleLogin = () => {
        axios.post('http://localhost:3001/login', { username, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                setIsLoggedIn(true);
                toast.success('Logged in successfully!');
            })
            .catch(err => {
                toast.error('Login failed!');
                console.log(err);
            });
    };

    const handleRegister = () => {
        axios.post('http://localhost:3001/register', { username, password })
            .then(response => {
                toast.success('Registered successfully! Please log in.');
                setIsRegistering(false); // Switch back to login after successful registration
            })
            .catch(err => {
                toast.error('Registration failed!');
                console.log(err);
            });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (isRegistering) {
                handleRegister();
            } else {
                handleLogin();
            }
        }
    };

    return (
        <div className="login-container" onKeyDown={handleKeyDown}>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
            />
            <button onClick={isRegistering ? handleRegister : handleLogin} className="login-btn">
                {isRegistering ? 'Register' : 'Login'}
            </button>
            <button onClick={() => setIsRegistering(!isRegistering)} className="toggle-btn">
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
            </button>
        </div>
    );
}

export default Login;
