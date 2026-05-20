import { getChatTitle, Selectors } from '../src/utils/dom';

describe('getChatTitle', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    test('Layer 1: should extract title from sidebar using chatId (jslog)', () => {
        document.body.innerHTML = `
            <div data-test-id="conversation" jslog="c_be5fa2b19a5e5421">
                <span class="conversation-title">Sidebar Title</span>
            </div>
        `;
        expect(getChatTitle('be5fa2b19a5e5421', document)).toBe('Sidebar Title');
    });

    test('Layer 1: should extract title from sidebar using chatId (href)', () => {
        document.body.innerHTML = `
            <a data-test-id="conversation" href="/app/be5fa2b19a5e5421">
                <span class="conversation-title">Sidebar Href Title</span>
            </a>
        `;
        expect(getChatTitle('be5fa2b19a5e5421', document)).toBe('Sidebar Href Title');
    });

    test('Layer 2: should extract title from selected sidebar item', () => {
        document.body.innerHTML = `
            <a data-test-id="conversation" class="selected">
                <span class="conversation-title">Selected Chat Title</span>
            </a>
        `;
        expect(getChatTitle(null, document)).toBe('Selected Chat Title');
    });

    test('Layer 3: should extract title from primary header', () => {
        document.body.innerHTML = `
            <span data-test-id="conversation-title">Primary Header Title</span>
        `;
        expect(getChatTitle(null, document)).toBe('Primary Header Title');
    });

    test('Layer 4: should extract title from secondary header (actions menu)', () => {
        document.body.innerHTML = `
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Secondary Header Title</span>
            </button>
        `;
        expect(getChatTitle(null, document)).toBe('Secondary Header Title');
    });

    test('Layer 5: should extract title from broad header (h2)', () => {
        document.body.innerHTML = `
            <h2 class="conversation-title">Broad H2 Title</h2>
        `;
        expect(getChatTitle(null, document)).toBe('Broad H2 Title');
    });

    test('should ignore generic titles like "Google Gemini"', () => {
        document.body.innerHTML = `
            <span data-test-id="conversation-title">Google Gemini</span>
            <button data-test-id="actions-menu-button">
                <span class="conversation-title">Gemini</span>
            </button>
        `;
        expect(getChatTitle(null, document)).toBeNull();
    });
});
