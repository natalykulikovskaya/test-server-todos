"use strict"
let express = require('express');
let router = express.Router();
let controller = require('../controllers/todo');
/* GET users listing. */
router.get('/',controller.getTodos);
router.post('/',controller.addTodo);
router.delete('/:id',controller.deleteTodo);
router.delete('/',controller.deleteCompleteTodo);
router.put('/:id', controller.editTodo);
router.put('/',controller.checkAllTodo);

module.exports = router;
