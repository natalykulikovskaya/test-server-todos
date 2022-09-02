const todoRouter = require('./todo');
const controllers = require('../controllers/todo');

jest.mock('../controllers/todo')
jest.mock('express', () => ({
  Router: () => ({
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    put: jest.fn(),
  }),
}))

describe('[Router] todos', () => {
  it('Exports get with getTodos', () => {
    expect(todoRouter.get).toHaveBeenCalledWith('/', controllers.getTodos)
  })
  it('Exports post with addTodo', () => {
    expect(todoRouter.post).toHaveBeenCalledWith('/', controllers.addTodo)
  })
  it('Exports delete with deleteTodo', () => {
    expect(todoRouter.delete).toHaveBeenCalledWith('/:id', controllers.deleteTodo)
  })
  it('Exports delete with deleteCompleteTodo', () => {
    expect(todoRouter.delete).toHaveBeenCalledWith('/', controllers.deleteCompleteTodo)
  })
  it('Exports put with editTodo', () => {
    expect(todoRouter.put).toHaveBeenCalledWith('/:id', controllers.editTodo)
  })
  it('Exports put with checkAllTodo', () => {
    expect(todoRouter.put).toHaveBeenCalledWith('/', controllers.checkAllTodo)
  })
})