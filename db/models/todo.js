"use strict"
let mongoose = require('mongoose');


let todoSchema = mongoose.Schema({
    name: String,
    status: {
        type: Boolean,
        default: false
    }
});
 let Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo;


