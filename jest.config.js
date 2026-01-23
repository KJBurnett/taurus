export default {
    testEnvironment: 'jsdom',
    transform: {},
    setupFiles: ['./tests/setup.js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
