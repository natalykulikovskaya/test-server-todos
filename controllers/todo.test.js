let mockF;
const todoControllers = require('./todo');

const FIND_SUCCESS_RESULT = [
    {name: 'Learn English', status: false, _id: '12as-1212zxz-12asfg'},
    {name: 'Learn Spanish', status: false, _id: '12dd-1212zxz-12lllfg'}
]

const CREATE_SUCCESS_RESULT = {name: 'Learn Spanish', status: false, _id: '12dd-1212zxz-12lllfg'};

const FIND_BY_ID_SUCCESS_RESULT = {name: 'Learn Italian', status: true, _id: 'ssdd-1212zxz-12lllfg'};

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
    res.send = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    return res
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
        })
        it('controller return error if 200', async () => {
            mockF.mockImplementation(() => Promise.reject('Array is empty'))
            const req = mockRequest();
            const res = mockResponse();
            await todoControllers.getTodos(req, res);
            expect(res.status).toBe(400);
        })
    })
    describe('addTodos controller', () => {
        it('if status 200 return new Todo', async () => {
            mockF.mockImplementation(() => Promise.resolve(CREATE_SUCCESS_RESULT))
            let req = mockRequest();
            req.params.name = 'Learn Spanish';
            const res = mockResponse();

            await todoControllers.addTodo(req, res);
            expect(res.send).toHaveBeenCalledTimes(1)

        })
        it('if status 400 return error', async () => {
            mockF.mockImplementation(() => Promise.reject('Unable to add todo in list'))
            let req = mockRequest();
            req.params.name = 'Learn English';
            const res = mockResponse();

            await todoControllers.addTodo(req, res);
            console.log(res.status.mock)
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith(
                'Unable to add todo in list');
        })
    })
})
