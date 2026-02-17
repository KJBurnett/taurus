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
        expect(getChatTitle(null, document)).toBe('Sim Rig Work');
    });

    test('should extract title from sidebar using chatId', () => {
        document.body.innerHTML = `
            <conversations-list>
                <div data-test-id="conversation" jslog="c_be5fa2b19a5e5421">
                    <span class="conversation-title">Sidebar Real Title</span>
                </div>
            </conversations-list>
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Google Gemini</span> <!-- Should be ignored -->
            </button>
        `;
        expect(getChatTitle('be5fa2b19a5e5421', document)).toBe('Sidebar Real Title');
    });

    test('should ignore generic titles like "Google Gemini"', () => {
        document.body.innerHTML = `
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Google Gemini</span>
            </button>
        `;
        expect(getChatTitle(null, document)).toBeNull();
    });

    test('should return null if no valid title found', () => {
        document.body.innerHTML = `
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Gemini</span>
            </button>
        `;
        expect(getChatTitle(null, document)).toBeNull();
    });
});
