import { getChatTitle, Selectors } from '../src/utils/dom';

describe('getChatTitle', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('should extract title from main header', () => {
        document.body.innerHTML = `
            <div class="top-bar-actions">
                <div class="conversation-title">Sim Rig Work</div>
            </div>
        `;
        expect(getChatTitle(document)).toBe('Sim Rig Work');
    });

    test('should ignore titles in sidebar (pinned/recent chats)', () => {
        document.body.innerHTML = `
            <conversations-list>
                <div class="conversation-items-container">
                    <div class="conversation-title">Moving Discussion</div>
                </div>
            </conversations-list>
            <div class="top-bar-actions">
                <div class="conversation-title">Sim Rig Work</div>
            </div>
        `;
        expect(getChatTitle(document)).toBe('Sim Rig Work');
    });

    test('should return null if no title found', () => {
        document.body.innerHTML = `<div>Just some content</div>`;
        expect(getChatTitle(document)).toBeNull();
    });

    test('should return null if only sidebar titles exist', () => {
        document.body.innerHTML = `
            <conversations-list>
                <div class="conversation-title">Sidebar Chat</div>
            </conversations-list>
        `;
        expect(getChatTitle(document)).toBeNull();
    });
});
