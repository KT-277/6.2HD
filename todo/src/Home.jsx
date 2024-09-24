import React, { useEffect, useState } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillTrashFill, BsFillCheckCircleFill, BsArrowDown, BsFillMoonFill, BsFillSunFill, BsDoorOpen } from "react-icons/bs";
import './Home.css';
import { toast } from 'react-toastify';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home({ setIsLoggedIn, toggleDarkMode, darkMode }) {
    const [todos, setTodos] = useState([]);
    const [showAll, setShowAll] = useState(false); // State to control showing all tasks

    useEffect(() => {
        AOS.init();
        const token = localStorage.getItem('token');
        axios.get("http://localhost:3001/get", {
            headers: {
                Authorization: token
            }
        })
        .then(result => setTodos(result.data))
        .catch(err => console.log(err));
    }, []);

    const handleEdit = (id) => {
        const token = localStorage.getItem('token');
        axios.put("http://localhost:3001/update/" + id, {}, {
            headers: {
                Authorization: token
            }
        })
        .then(() => {
            setTodos(prevTodos => prevTodos.map(todo => todo._id === id ? { ...todo, done: !todo.done } : todo));
            toast.success('Task updated successfully!');
        })
        .catch(err => console.log(err));
    };

    const handleDelete = (id) => {
        const token = localStorage.getItem('token');
        axios.delete("http://localhost:3001/delete/" + id, {
            headers: {
                Authorization: token
            }
        })
        .then(() => {
            setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
            toast.success('Task deleted successfully!');
        })
        .catch(err => console.log(err));
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        toast.info('Logged out successfully!');
    };

    const handleViewMore = () => {
        setShowAll(true); // Set to true to show all tasks
    };

    return (
        <div id='home'>
            <div className='logout-container'>
                <button onClick={toggleDarkMode} className="mode-btn">
                    {darkMode ? <BsFillSunFill size={24} color="lightgoldenrodyellow" /> : <BsFillMoonFill size={24} color="darkgrey" />}
                </button>
                <button onClick={handleLogout} className="logout-btn">
                    <BsDoorOpen size={24} color="#0d47a1" />
                </button>
            </div>
            <h2>To-Do List</h2>
            <Create setTodos={setTodos} />
            <div className="todo-list">
                {todos.length === 0
                    ? <h2 className='notasks'>No tasks left</h2>
                    : (showAll ? todos : todos.slice(0, 4)).map(todo => (
                        <div className='task' key={todo._id} data-aos="fade-up">
                            <div className="task_info" onClick={() => handleEdit(todo._id)}>
                                {todo.done ? <BsFillCheckCircleFill className='icon' /> : <BsCircleFill className='icon' />}
                                <p className={todo.done ? "line_through" : ""} style={{ marginLeft: '10px' }}>{todo.task}</p>
                            </div>
                            <BsFillTrashFill className="icon" onClick={() => handleDelete(todo._id)} />
                        </div>
                    ))
                }
            </div>
            {!showAll && todos.length > 4 && (
                <button onClick={handleViewMore} className="view-more-btn">
                    View More <BsArrowDown />
                </button>
            )}
        </div>
    );
}

export default Home;
