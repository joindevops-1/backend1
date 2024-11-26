const db = require('TransactionService'); // Replace with your file's name
const { mockQuery } = require('mysql2');

describe('Database Function Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('addTransaction should execute the correct query', () => {
        const amount = 100;
        const description = "Test Description";
        db.addTransaction(amount, description);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            `INSERT INTO \`transactions\` (\`amount\`, \`description\`) VALUES ('${amount}','${description}')`,
            expect.any(Function)
        );
    });

    test('getAllTransactions should execute the correct query and return results via callback', () => {
        const mockResult = [{ id: 1, amount: 100, description: "Test" }];
        const callback = jest.fn();
        mockQuery.mockImplementation((sql, cb) => cb(null, mockResult));

        db.getAllTransactions(callback);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM transactions", expect.any(Function));
        expect(callback).toHaveBeenCalledWith(mockResult);
    });

    test('findTransactionById should execute the correct query and return results via callback', () => {
        const id = 1;
        const mockResult = [{ id: 1, amount: 100, description: "Test" }];
        const callback = jest.fn();
        mockQuery.mockImplementation((sql, cb) => cb(null, mockResult));

        db.findTransactionById(id, callback);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            `SELECT * FROM transactions WHERE id = ${id}`,
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(mockResult);
    });

    test('deleteAllTransactions should execute the correct query', () => {
        const callback = jest.fn();
        const mockResult = { affectedRows: 5 };
        mockQuery.mockImplementation((sql, cb) => cb(null, mockResult));

        db.deleteAllTransactions(callback);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith("DELETE FROM transactions", expect.any(Function));
        expect(callback).toHaveBeenCalledWith(mockResult);
    });

    test('deleteTransactionById should execute the correct query', () => {
        const id = 1;
        const callback = jest.fn();
        const mockResult = { affectedRows: 1 };
        mockQuery.mockImplementation((sql, cb) => cb(null, mockResult));

        db.deleteTransactionById(id, callback);

        expect(mockQuery).toHaveBeenCalledTimes(1);
        expect(mockQuery).toHaveBeenCalledWith(
            `DELETE FROM transactions WHERE id = ${id}`,
            expect.any(Function)
        );
        expect(callback).toHaveBeenCalledWith(mockResult);
    });
});
