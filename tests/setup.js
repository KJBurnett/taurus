
// Mock Chrome API
global.chrome = {
    runtime: {
        getURL: (path) => path,
        lastError: null
    },
    storage: {
        sync: {
            get: (keys, cb) => cb({}),
            set: (data, cb) => cb()
        },
        local: {
            get: (keys, cb) => cb({}),
            set: (data, cb) => cb()
        },
        onChanged: {
            addListener: () => { }
        }
    }
};

// Mock document.body if needed (JSDOM handles this, but good to ensure)
if (!global.document) {
    global.document = { body: {} };
}
