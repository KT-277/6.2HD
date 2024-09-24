import React, { useState } from 'react';
import axios from 'axios';
import './Create.css';

function Create({ setTodos }) {
    const [task, setTask] = useState('');

    const handleAdd = () => {
        if (!task) {
            alert('Please enter the task');
            return;
        }

        axios.post('http://localhost:3001/add', { task }, {
            headers: {
                Authorization: localStorage.getItem('token'),
            },
        })
            .then(response => {
                setTodos(prevTodos => [...prevTodos, response.data]);
                setTask('');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='create_form'>
            <input
                type="text"
                placeholder='Enter task'
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="task-input"
            />
            <button type="button" className="addbtn" onClick={handleAdd}>Add</button>
        </div>
    );
}

export default Create;
