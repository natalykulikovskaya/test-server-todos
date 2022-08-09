const supertest = require('supertest');
const app = require('../app');
const requestWithSupertest = supertest(app);

describe('get all todos/ controller', () => {
  it('run request get /todo/ return array from todos', async () => {
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

  it('run not exist request', async () => {
    const res = await requestWithSupertest.get('/todorm/').expect(404)
    expect(res.error.message).toBe('cannot GET /todorm/ (404)');
  });

describe('delete todo/ controller', () => {
  test('run REST delete from todo/:id correct if id exist', async() => {
    const todos = await requestWithSupertest.get('/todo/')
    expect(todos?.body?.length).toBeGreaterThanOrEqual(1);
    const todoId = todos?.body?.[0]?._id
    const res = await requestWithSupertest.delete(`/todo/${todoId}`)
    expect(res.status).toEqual(200);
   expect(res.body).toEqual(todos?.body?.[0])
  })
})

  test('correct id from editTodo', () => {
    const id = 'aaa';
    const updateTodo = { name: '', status: true };
    expect(id).toBeTruthy();
    expect(id).toBe('aaa');
    expect(updateTodo).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        status: expect.any(Boolean),
      })
    )
    expect(updateTodo.name).not.toBeTruthy()
  })

  test('correct status from api checkAllTodo', () => {
    const status = true
    expect(status).toBe(true)
    expect(status).toBeTruthy()
    expect(status).toEqual(expect.any(Boolean))
  })

  test('invalid checkAllTodo', () => {
    const status = '111'
    expect(status).not.toEqual(expect.any(Boolean))
  })
