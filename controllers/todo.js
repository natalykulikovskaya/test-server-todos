"use strict"
let Todo = require('../db/models/todo');

const getTodos = (req, res) => {
   return Todo.find()
        .then(function (data) {
            res.status(200).send(data)
        })
        .catch(function (e) {
            return res.status(500).send('internal error')
        })

};

const addTodo = (req, res) => {
    const name = req.body.name;
  if(name){
    return Todo.create({name: name})
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
    return Todo.deleteMany({status: true})
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
       return Todo.findByIdAndUpdate(id, updateTodo, {
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
    return Todo.updateMany({}, {$set: {status: status}})
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
