"use strict"
let Todo = require('../db/models/todo');

const getTodos = (req, res) => {
    Todo.find()
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (e) {
            res.status(e.status).send(e)
        })

};

const addTodo = (req, res) => {
    const name = req.body.name;
  if(name){
    Todo.create({name: name})
      .then(function (data) {
        res.status(200).send(data);
      })
      .catch( (e) => {
        return res.status(e.status).send(e);
      })
  } else {
     return res.status(403).send({message: 'Unable to create todo - empty name'});
  }

};


const deleteTodo = (req, res) => {
    const id = req.params.id;
    Todo.findByIdAndRemove(id)
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function () {
            return res.status(400).send('Todo was not found');
        })
}


const deleteCompleteTodo = (req, res) => {
    Todo.deleteMany({status: true})
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function () {
            return res.status(400).send('Error delete all complete todos');
        })

}


const editTodo = (req, res) => {
    let id = req.params.id;
    let updateTodo = req.body;
       Todo.findByIdAndUpdate(id, updateTodo, {
         returnDocument: 'after',
        $set: updateTodo,
    })
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function () {
            return res.status(400).send('Todo was not found ');
        })
}


const checkAllTodo = (req, res) => {
    let status = req.body.status;
    Todo.updateMany({}, {$set: {status: status}})
        .then(function (data) {
            res.status(200).send(data);
        })
        .catch(function () {
            return res.status(400).send('Todo was not found');
        })
}


module.exports = {
    getTodos,
    addTodo,
    deleteTodo,
    deleteCompleteTodo,
    checkAllTodo,
    editTodo
};
