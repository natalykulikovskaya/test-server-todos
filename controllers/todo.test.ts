const supertest = require('supertest');
const app = require('../app');
const requestWithSupertest = supertest(app);

describe('get all todos/ controller', () => {
  it('run controller get /todo/ return array from todos', async () => {
    const res = await requestWithSupertest.get('/todo/').expect('Content-Type', "application/json; charset=utf-8");
    expect(res.status).toEqual(200);
    expect(res.type).toEqual(expect.stringContaining('json'));
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(String),

          name: expect.any(String),

          status: expect.any(Boolean),
        }),
      ])
    );
  });

});

  it('run not exist controller', async () => {
    const res = await requestWithSupertest.get('/todorm/').expect(404)
    expect(res.error.status).toBe(404);
  });

describe('delete todo/:id controller', () => {
  it('run controller delete todo/:id correct if id exist', async() => {
    const todos = await requestWithSupertest.get('/todo/')
    expect(todos?.body?.length).toBeGreaterThanOrEqual(1);
    const todoId = todos?.body?.[0]?._id
    const res = await requestWithSupertest.delete(`/todo/${todoId}`)
    expect(res.status).toEqual(200);
   expect(res.body).toEqual(todos?.body?.[0])
  })
})

describe('post todo/ controller', () => {
  it('then get correct name, new todo insert in database', async() => {
    const addTodoBody = {name:'study tests', status: false };
    const res = await requestWithSupertest.post(`/todo/`).send(addTodoBody);
    expect(res.status).toEqual(200);
  })

  it('then get empty name, get error 403', async() => {
    const name =''
    const addTodoBody = {name, status: false };
    const res = await requestWithSupertest.post(`/todo/`).send(addTodoBody)
    expect(res.status).toEqual(403);
  })
})


describe('delete todo/ controller', () => {
  it('all todos delete from database', async() => {
    const res = await requestWithSupertest.delete(`/todo/`);
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expect.arrayContaining([]));
  })
})

describe('put todo/ controller', () => {
  it('all todos change status field on true', async() => {
    const checkAll = true;
    const res = await requestWithSupertest.put(`/todo/`).send({ status: checkAll });
    expect(res.status).toEqual(200);
    expect(res.body).toEqual(expect.objectContaining({
     ...res.body,
      acknowledged: true,
    }));
  })
})

describe('put todo/:id controller', () => {
  it('if correct name todo it value change', async() => {
    const todos = await requestWithSupertest.get(`/todo/`);
    expect(todos.body.length).toBeGreaterThanOrEqual(1)
    const updateTodo = { ...todos.body?.[0], name: 'sss'};
    const res = await requestWithSupertest.put(`/todo/${updateTodo._id}`).send(updateTodo);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining(updateTodo)
    );
  });
});
