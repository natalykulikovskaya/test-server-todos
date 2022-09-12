const { MongoMemoryServer }  = require('mongodb-memory-server');
const mongoose = require('mongoose');
let Todo = require('./models/todo');

describe('create mock DB',() => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    await mongoose.connect(uri, { dbName: "todos" });

  })
  afterEach(async () => {
    await Todo.deleteMany();
  })

  afterAll(async () => {
    await mongod.stop();
    await mongoose.disconnect();
  })

  describe('getTodos', () => {
    it('Todo.find in initial DB return empty',async () => {
      const cnt = await Todo.find().then(
        function (data){
          return data
        }
      );
      expect(cnt.length).toBe(0);
    })

    it('Todo.find from 3 records return arrayTodos have length 3',async () => {
      const initialTodos = [
        {name: '111', status: false},
        {name: '222', status: false},
        {name: '333', status: false},
      ]
      await Todo.create(initialTodos);
      const cnt = await Todo.find().then(
        function (data){
          return data
        }
      );
      console.log('cnt', cnt)
      expect(cnt.length).toBe(3);
    })
  })

  describe('addTodo', () => {
      it('Todo.find in DB add new record',async () => {
        const name = {name: '4444'}
        const cnt = await Todo.create(name).then(
          function (data){
            return data
          }
        );
        expect(cnt).toHaveProperty('name', '4444')
      })
    })

  describe('deleteTodo', () => {
    it('Todo.delete record in DB',async () => {
      const initialTodos = [
        {name: '111', status: false},
        {name: '222', status: false},
        {name: '333', status: false},
      ]
     const todos =  await Todo.create(initialTodos);
      const id = todos?.[0]?._id;
      await Todo.findByIdAndRemove(id);
      const newDataDB = await Todo.find();
      expect(newDataDB).not.toHaveProperty('_id', id)
    })
  })

  describe('delete all complete Todo', () => {
    it('Todo.deleteMany drop all record with status: true',async () => {
      const initialTodos = [
        {name: 'aaa', status: false},
        {name: 'bbb', status: true},
        {name: 'ccc', status: true},
      ]
      await Todo.create(initialTodos);
      await Todo.deleteMany({status: true});
      const newDataDB = await Todo.find();
      expect(newDataDB.length).toEqual(1);
    })
  })

  describe('edit Todo', () => {
    it('Todo.findByIdAndUpdate change exist record',async () => {
      const initialTodos = [
        {name: '111', status: false},
        {name: '222', status: true},
        {name: '333', status: true},
      ]
      const initialDataDb = await Todo.create(initialTodos);
      const editTodosId = initialDataDb?.[1]?._id;
      const updateTodo = {name: '4444', status: true};
      await Todo.findByIdAndUpdate(editTodosId, updateTodo, {
        returnDocument: 'after',
        $set: updateTodo,
      });
      const newDataDB = await Todo.find();
      expect(newDataDB.length).toEqual(3);
      expect(newDataDB[1]).toHaveProperty('name', '4444');
      expect(newDataDB[1]).toHaveProperty('status', true)
    })
  })

  describe('check all Todo', () => {
    beforeAll(async () => {
      const initialTodos = [
        {name: '111', status: false},
        {name: '222', status: false},
        {name: '333', status: true},
      ]
      await Todo.create(initialTodos);
    })

    it('Todo.updateMany if status equal true change all status on true',async () => {
      const status = true;
      await  Todo.updateMany({}, {$set: {status}})
      const newDataDB = await Todo.find();
      newDataDB.forEach(({status}) => {
        expect(status).toBe(true)
      })
    })

    it('Todo.updateMany if status equal false change all status on false',async () => {
      const status = false;
      await  Todo.updateMany({}, {$set: {status}})
      const newDataDB = await Todo.find();
      newDataDB.forEach(({status}) => {
        expect(status).toBe(false)
      })
    })
  })

})



