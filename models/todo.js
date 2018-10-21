const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    id: Number,
    title: String,
    completed: Boolean
});

module.exports = mongoose.model('Todo', todoSchema);