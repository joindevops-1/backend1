const mockQuery = jest.fn();

const createConnection = jest.fn(() => ({
    query: mockQuery,
}));

module.exports = {
    createConnection,
    mockQuery,
};
