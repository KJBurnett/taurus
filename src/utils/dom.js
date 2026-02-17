/**
 * DOM Selectors for Gemini Web App
 * Based on analysis of user-provided HTML.
 */

export const Selectors = {
    // The sidebar container where we will inject the folders list
    // Inject BEFORE the .title-container
    sidebarListContainer: 'conversations-list',
    sidebarTitleContainer: '.title-container',

    // Chat items in the sidebar
    chatItemContainer: 'div.conversation-items-container',
    chatItemClickable: 'div[data-test-id="conversation"]',
    chatTitle: '.conversation-title',

    // Header area for actions
    geminiLogoContainer: '.bard-logo-container',
    headerContainer: '.top-bar-actions .center-section',
    headerLeftSection: '.top-bar-actions .left-section',
    headerRightSection: '.top-bar-actions .right-section',
    conversationActions: 'conversation-actions',

    // Helper to extract Chat ID from the jslog attribute
    // Example: jslog="...[&quot;c_be5fa2b19a5e5421&quot;...]..."
    getChatIdFromElement: (element) => {
        const jslog = element.getAttribute('jslog');
        if (!jslog) return null;
        const match = jslog.match(/c_([a-f0-9]+)/);
        return match ? match[1] : null;
    }
};

export function waitForElement(selector, parent = document) {
    return new Promise(resolve => {
        if (parent.querySelector(selector)) {
            return resolve(parent.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (parent.querySelector(selector)) {
                resolve(parent.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(parent, {
            childList: true,
            subtree: true
        });
    });
}

/**
 * Robustly extract the current chat title, avoiding sidebar elements.
 * @param {string|null} chatId - Optional ID to look up specifically in sidebar.
 * @param {Document|Element} root 
 * @returns {string|null}
 */
export function getChatTitle(chatId = null, root = document) {
    const isGenericTitle = (text) => {
        if (!text) return true;
        const low = text.toLowerCase();
        return low === 'gemini' ||
            low === 'google gemini' ||
            low === 'untitled' ||
            low === 'untitled chat' ||
            low === 'new chat' ||
            low === 'main menu';
    };

    // 1. If we have a chatId, find the precise item in the sidebar first.
    // The sidebar usually has the real title even while the header is loading.
    if (chatId) {
        const sidebarItems = root.querySelectorAll(Selectors.chatItemClickable);
        for (const item of sidebarItems) {
            if (Selectors.getChatIdFromElement(item) === chatId) {
                const titleEl = item.querySelector(Selectors.chatTitle);
                if (titleEl) {
                    const text = titleEl.textContent.trim();
                    if (text && !isGenericTitle(text)) return text;
                }
            }
        }
    }

    // 2. Try the specific header selector
    const headerTitle = root.querySelector('[data-test-id="actions-menu-button"] .conversation-title');
    if (headerTitle) {
        const text = headerTitle.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    // 3. Last resort: general search but excluding sidebars
    const titles = root.querySelectorAll(Selectors.chatTitle);
    for (const titleEl of titles) {
        if (titleEl.closest(Selectors.sidebarListContainer)) continue;
        if (titleEl.closest(Selectors.chatItemContainer)) continue;

        const text = titleEl.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    return null;
}
