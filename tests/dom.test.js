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

    test('should extract title from main header (specific selector)', () => {
        document.body.innerHTML = `
            <div class="center-section">
                <button data-test-id="actions-menu-button">
                    <span class="conversation-title">Sim Rig Work</span>
                </button>
            </div>
        `;
        expect(getChatTitle(document)).toBe('Sim Rig Work');
    });

    test('should ignore titles in sidebar even if they match', () => {
        document.body.innerHTML = `
            <conversations-list>
                <div class="conversation-title">Sidebar Chat</div>
            </conversations-list>
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Main Chat</span>
            </button>
        `;
        expect(getChatTitle(document)).toBe('Main Chat');
    });

    test('should return null if title is just whitespace', () => {
        document.body.innerHTML = `
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">   </span>
            </button>
        `;
        expect(getChatTitle(document)).toBeNull();
    });
});
