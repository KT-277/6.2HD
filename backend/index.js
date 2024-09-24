require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TodoModel = require('./models/todo');
const User = require('./models/user'); 
const app = express();

const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.SECRET_KEY; 
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};

// Register route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Get all todos for the logged-in user
app.get('/get', verifyToken, async (req, res) => {
    try {
        const todos = await TodoModel.find({ userId: req.user.id }); // Fetch tasks based on logged-in user
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving todos' });
    }
});

// Add new todo for the logged-in user
app.post('/add', verifyToken, async (req, res) => {
    const { task, priority } = req.body; // Get task and priority
    const newTodo = new TodoModel({ task, priority, userId: req.user.id }); // Associate task with user
    try {
        await newTodo.save();
        res.json(newTodo);
    } catch (error) {
        res.status(500).json({ message: 'Error adding todo' });
    }
});

// Update todo status
app.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (todo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this todo' });
        }
        todo.done = !todo.done; // Toggle done status
        await todo.save();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error updating todo' });
    }
});

// Delete todo
app.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const todo = await TodoModel.findById(req.params.id);
        if (todo.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this todo' });
        }
        await TodoModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
