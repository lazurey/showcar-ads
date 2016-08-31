import { getAttribute, setAttribute, hasAttribute } from './dom';
import { parseSizeMappingFromElement } from './double-click';

const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdSlot extends HTMLElement {
        attachedCallback () {
            const element = this;
            const elementId = getAttribute(element, 'element-id') || `ad-slot-element-${Math.random() * 1000000 | 0}`;
            const adunit = getAttribute(element, 'ad-unit');
            const outOfPage = hasAttribute(element, 'out-of-page');

            parseSizeMappingFromElement(element);

            setAttribute(element, 'empty', '');
        }

        detachedCallback() {}

        refreshAdSlot() {}
    }

    document.registerElement(name || 'as24-ad-slot', AS24AdSlot);
};

export default registerElement;
