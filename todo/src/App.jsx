import { useState, useEffect } from 'react';
import './App.css';
import Home from './Home';
import Login from './Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={darkMode ? "dark-mode" : ""}>
            {isLoggedIn ? (
                <Home setIsLoggedIn={setIsLoggedIn} toggleDarkMode={toggleDarkMode} />
            ) : (
                <Login setIsLoggedIn={setIsLoggedIn} />
            )}
            <ToastContainer />
        </div>
    );
}

export default App;
