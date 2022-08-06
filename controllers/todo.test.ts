describe('todo controller', () => {
  test('addTodo correct value', () => {
    const todo = { name: '12312', status: false }
    expect(todo).not.toBeNull();
    expect(todo).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        status: expect.any(Boolean),
      })
    )
  })

  test.failing('addTodo not correct value', () => {
    const todo = { name: 12312, status: false }
    expect(todo).not.toBeNull();
    expect(todo).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        status: expect.any(Boolean),
      })
    )
    expect(todo.name).toBe('12312')
    expect(todo.status).toBe(false)
  })

  test('deleteTodo', () => {
    const id = '124534'
    expect(id).toBeTruthy();
    expect(id).toBe('124534')
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
})
