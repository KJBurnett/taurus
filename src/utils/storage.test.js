
import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mock Storage
const mockSync = {
    get: (keys, cb) => cb({}),
    set: (data, cb) => cb()
};

global.chrome = {
    runtime: { lastError: null },
    storage: {
        sync: mockSync,
        onChanged: { addListener: () => { } }
    }
};

// Hoisting workaround for ESM: Dynamic Import
const { Storage } = await import('./storage.js');

describe('Storage Utility', () => {
    beforeEach(() => {
        mockSync.get = jest.fn((keys, cb) => cb({ gemini_folders_data: { folders: [] } }));
        mockSync.set = jest.fn((data, cb) => cb());
    });

    test('addFolder should include color if provided', async () => {
        await Storage.addFolder('Test', 'blue');

        expect(mockSync.set).toHaveBeenCalled();
        const dataSent = mockSync.set.mock.calls[0][0].gemini_folders_data;
        expect(dataSent.folders[0]).toMatchObject({ name: 'Test', color: 'blue' });
    });

    test('updateFolder should change color of existing folder', async () => {
        const folderId = 'f1';
        mockSync.get = jest.fn((keys, cb) => cb({
            gemini_folders_data: { folders: [{ id: folderId, name: 'old', color: 'red', chats: [] }] }
        }));

        await Storage.updateFolder(folderId, { color: 'green' });

        const dataSent = mockSync.set.mock.calls[0][0].gemini_folders_data;
        expect(dataSent.folders[0].color).toBe('green');
    });
});
