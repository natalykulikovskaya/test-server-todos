let mockF;
const todoControllers = require('./todo');

const FIND_SUCCESS_RESULT = [
    {name: 'Learn English', status: false, _id: '12as-1212zxz-12asfg'},
    {name: 'Learn Spanish', status: false, _id: '12dd-1212zxz-12lllfg'}
]

const CREATE_SUCCESS_RESULT = {name: 'Learn Spanish', status: false, _id: '12dd-1212zxz-12lllfg'};

const FIND_BY_ID_SUCCESS_RESULT = {name: 'Learn Italian', status: true, _id: 'ssdd-1212zxz-12lllfg'};

const DELETE_COMPLETE_TODO_SUCCESS_RESULT = [
    {name: 'Learn English', status: false, _id: '12as-1212zxz-12asfg'},
    {name: 'Learn Spanish', status: false, _id: '12dd-1212zxz-12lllfg'}
]

const EDIT_SUCCESS_RESULT = {name: 'Study JS', status: true, _id: '12dd-1212zxz-12lllfg'};

const CHECK_ALL_STATUS_COMPLETE_TODO_SUCCESS_RESULT = [
    {name: 'Learn English', status: true, _id: '12as-1212zxz-12asfg'},
    {name: 'Learn Spanish', status: true, _id: '12dd-1212zxz-12lllfg'}
]

jest.mock('../db/models/todo', () => {
    const originalModule = jest.requireActual('../db/models/todo');
    mockF = jest.fn();
    return {
        ...originalModule,
        find: mockF,
        create: mockF,
        findByIdAndRemove: mockF,
        deleteMany: mockF,
        findByIdAndUpdate: mockF,
        updateMany: mockF,
    };
})

const mockRequest = () => {
    const req = { body: null, params: null };
    req.body = jest.fn().mockReturnValue(req)
    req.params = jest.fn().mockReturnValue(req)
    return req
};

const mockResponse = () => {
    const res = { send: null, status: null };
    res.send = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('controllers', () => {
    afterEach(() => {
        mockF.mockClear();
        jest.clearAllMocks();
    })

    describe('getTodos controller', () => {
        it('controller return value if 200', async () => {
            mockF.mockImplementation(() => Promise.resolve(FIND_SUCCESS_RESULT))
            const req = mockRequest();
            const res = mockResponse();
            await todoControllers.getTodos(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
        })
        it('controller return error if 400', async () => {
            mockF.mockImplementation(() => Promise.reject(new Error('internal error')))
            const req = mockRequest();
            const res = mockResponse();
            const s = await todoControllers.getTodos(req, res)
                console.log('sdfsdsfd',res.send.mock.calls)
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.send.mock.calls[0][0]).toEqual('internal error');
        })
    })
    describe('addTodos controller', () => {
        it('if status 200 return new Todo', async () => {
            mockF.mockImplementation(() => Promise.resolve(CREATE_SUCCESS_RESULT))
            let req = mockRequest();
            req.body.name = 'Learn Spanish';
            const res = mockResponse();

            await todoControllers.addTodo(req, res);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);

        })
        it('if exist name and reject return status 400 and error', async () => {
            mockF.mockImplementation(() => Promise.reject({message: 'Not found'}))
            let req = mockRequest();
            req.body.name = 'Learn English';
            const res = mockResponse();

            try {
                await todoControllers.addTodo(req, res);
            } catch(e){
                expect(e.status).toHaveBeenCalledWith(400);
                expect(e.send).toHaveBeenCalledWith({message: 'Not found'});
            }
        })

        it('if not exist name and reject return status 400 and error', async () => {
            mockF.mockImplementation(() => Promise.resolve({message: 'Unable to create todo - empty name'}))
            let req = mockRequest();
            req.body.name = null;
            const res = mockResponse();

            try {
                await todoControllers.addTodo(req, res);
            }catch(e){
                expect(e.status).toHaveBeenCalledWith(403);
                expect(e.send).toHaveBeenCalledWith({ message: 'Not Found' });
            }
        })
    })
    describe('deleteTodo controller', () => {
        it('if status 200 delete Todo by id', async () => {
            mockF.mockImplementation(() => Promise.resolve(FIND_BY_ID_SUCCESS_RESULT))
            let req = mockRequest();
            req.params.id = 'ssdd-1212zxz-12lllfg';
            const res = mockResponse();

            await todoControllers.deleteTodo(req,res)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);

        })
    })

    describe('deleteCompleteTodo controller', () => {
        it('if status 200 delete all todo with status true', async () => {
            mockF.mockImplementation(() => Promise.resolve(DELETE_COMPLETE_TODO_SUCCESS_RESULT))
            let req = mockRequest();
            const res = mockResponse();

            await todoControllers.deleteCompleteTodo(req,res)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send.mock.calls[0][0].length).toBe(2);
        })
    })

    describe('editTodo controller', () => {
        it('if status 200 edit todo', async () => {
            mockF.mockImplementation(() => Promise.resolve(EDIT_SUCCESS_RESULT))
            let req = mockRequest();
            req.params.id = '12dd-1212zxz-12lllfg';
            req.body = {name: 'Study JS', status: true}
            const res = mockResponse();

            await todoControllers.editTodo(req,res)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send.mock.calls[0].length).toBe(1);
        })
    })

    describe('checkAllTodo controller', () => {
        it('if status 200 change status all todo', async () => {
            mockF.mockImplementation(() => Promise.resolve(CHECK_ALL_STATUS_COMPLETE_TODO_SUCCESS_RESULT))
            let req = mockRequest();
            req.body = {status: true}
            const res = mockResponse();

            await todoControllers.checkAllTodo(req,res)
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send.mock.calls[0][0].length).toBe(2);
        })
    })
})
