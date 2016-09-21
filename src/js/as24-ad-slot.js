import { getAttribute, setAttribute, hasAttribute, addCss } from './dom';
import { parseSizeMappingFromElement, getEligibleAdsSizes, registerAdSlot, destroyAdSlot, refreshAdSlot } from './double-click';
import uuid from './uuid';

import registerDoubleclickAdslot from './double-click-ad-slots';

const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdSlot extends HTMLElement {
        attachedCallback () {
            const element = this;

// <as24... size-map-123x123="1x2,1x2,1x2">
// 1. normalize attribute set of a tag (debuggin)
// 1.1 convert attrs into data structure
// 1.2 sort size mapping attrs from greater to lower
// 1.3 add 0x0 mapping if it is missing
// 1.4 debug: add `size-mapping="<data structure>"`

// 2. find eligible ads sizes for the current resolution
// 3. if there are such sizes move on...

            const sizeMapping = parseSizeMappingFromElement(element);

            setAttribute(element, 'size-mapping', JSON.stringify(sizeMapping));

            const pageResolution = {
                x: window.innerWidth,
                y: window.innerHeight
            };

            const eligibleSizes = getEligibleAdsSizes(pageResolution, sizeMapping);

            if (!eligibleSizes || !eligibleSizes.length) { return; }

            const elementId = getAttribute(element, 'element-id') || `ad-${uuid()}`;
            const adunit = getAttribute(element, 'ad-unit');
            const outOfPage = hasAttribute(element, 'out-of-page');
            const container = document.createElement('div');

            container.id = elementId;
            element.appendChild(container);

            this.adslot = registerDoubleclickAdslot({
                adunit,
                outOfPage,
                sizeMapping,
                container,
                slotElement: this
            });

            console.log('qqq', this.adslot);

            this.adslot.onload = eventData => {
                if (eventData.isEmpty) {
                    setAttribute('empty', '');
                }

                setAttribute('loaded', '');
            };
        }

        detachedCallback() {
            this.adslot.destroy();
        }

        refreshAdSlot() {
            this.adslot.refresh();
        }
    }

    addCss(`{name}{display:block}`);
    document.registerElement(name || 'as24-ad-slot', AS24AdSlot);
};

export default registerElement;
