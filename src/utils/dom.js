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
    chatItemClickable: 'div[data-test-id="conversation"], a[data-test-id="conversation"]',
    chatTitle: '.conversation-title',
    selectedChatItem: '[data-test-id="conversation"].selected, .conversation.selected, .conversation[aria-current="true"]',

    // Header area for actions
    geminiLogoContainer: '.bard-logo-container',
    headerContainer: '.top-bar-actions .center-section',
    headerLeftSection: '.top-bar-actions .left-section',
    headerRightSection: '.top-bar-actions .right-section',
    conversationActions: 'conversation-actions',
    headerTitle: '[data-test-id="conversation-title"]',
    actionsMenuTitle: '[data-test-id="actions-menu-button"] .conversation-title, [data-test-id="actions-menu-button"] .conversation-title',

    // Helper to extract Chat ID from the jslog attribute or href
    getChatIdFromElement: (element) => {
        // 1. Try jslog
        const jslog = element.getAttribute('jslog');
        if (jslog) {
            const match = jslog.match(/c_([a-f0-9]+)/);
            if (match) return match[1];
        }
        // 2. Try href (for <a> tags)
        const href = element.getAttribute('href');
        if (href) {
            const match = href.match(/\/app\/([a-f0-9]+)/);
            if (match) return match[1];
        }
        return null;
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

    // Layer 1: Specific Chat ID in the sidebar (High Confidence)
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

    // Layer 2: The 'Selected' item in the sidebar (Medium-High Confidence)
    const selectedItem = root.querySelector(Selectors.selectedChatItem);
    if (selectedItem) {
        const titleEl = selectedItem.querySelector(Selectors.chatTitle);
        if (titleEl) {
            const text = titleEl.textContent.trim();
            if (text && !isGenericTitle(text)) return text;
        }
    }

    // Layer 3: Primary Header Title Selector (Medium Confidence)
    const primaryHeader = root.querySelector(Selectors.headerTitle);
    if (primaryHeader) {
        const text = primaryHeader.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    // Layer 4: Secondary Header (inside menu button)
    const secondaryHeader = root.querySelector(Selectors.actionsMenuTitle);
    if (secondaryHeader) {
        const text = secondaryHeader.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    // Layer 5: Broad Header/H2 search
    const broadHeader = root.querySelector('h1.conversation-title, h2.conversation-title, .conversation-title-container .conversation-title');
    if (broadHeader) {
        const text = broadHeader.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    // Layer 6: Last resort, any title that isn't in a sidebar item
    const allTitles = root.querySelectorAll(Selectors.chatTitle);
    for (const titleEl of allTitles) {
        // Exclude titles that are inside a sidebar item (unless it's the selected one we already tried)
        if (titleEl.closest(Selectors.chatItemClickable)) continue;

        const text = titleEl.textContent.trim();
        if (text && !isGenericTitle(text)) return text;
    }

    return null;
}
