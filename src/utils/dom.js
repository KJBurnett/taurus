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
 * @param {Document|Element} root 
 * @returns {string|null}
 */
export function getChatTitle(root = document) {
    const titles = root.querySelectorAll(Selectors.chatTitle);

    for (const titleEl of titles) {
        // Exclude titles in the sidebar (conversations-list)
        if (titleEl.closest(Selectors.sidebarListContainer)) {
            continue;
        }
        // Exclude titles in the sidebar items container
        if (titleEl.closest(Selectors.chatItemContainer)) {
            continue;
        }

        // Exclude empty titles
        const text = titleEl.textContent.trim();
        if (text) return text;
    }

    return null;
}
