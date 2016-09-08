import { getAttribute, setAttribute, hasAttribute, addCss } from './dom';
import { parseSizeMappingFromElement, gptinit, registerAdSlot, destroyAdSlot, refreshAdSlot } from './double-click';
import uuid from './uuid';

const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdSlot extends HTMLElement {
        attachedCallback () {
            const element = this;

            const sizeMapping = parseSizeMappingFromElement(element);
            const notShownDueToSizeMapping = false; // TODO
            if (notShownDueToSizeMapping) { return ;}

            const elementId = getAttribute(element, 'element-id') || `ad-${uuid()}`;
            const adunit = getAttribute(element, 'ad-unit');
            const outOfPage = hasAttribute(element, 'out-of-page');

            setAttribute(element, 'empty', '');

            const adContainer = document.createElement('div');
            adContainer.id = elementId;
            element.appendChild(adContainer);

            this.adSlot = registerAdSlot({
                adunit,
                outOfPage,
                sizeMapping,
                adContainer
            });

            this.refreshAdSlot();
        }

        detachedCallback() {
            destroyAdSlot(this.adSlot);
        }

        refreshAdSlot() {
            refreshAdSlot(this.adSlot);
        }
    }

    addCss(`{name}{display:block}`);
    document.registerElement(name || 'as24-ad-slot', AS24AdSlot);
};

export default registerElement;
