const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: { type: String, required: true },
    priority: { type: String, default: 'normal' },
    done: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Associate task with user
}, {
    timestamps: true,
});

const Todo = mongoose.model("Todo", todoSchema);
module.exports = Todo;
