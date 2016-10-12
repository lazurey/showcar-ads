import uuid from './uuid';
import { getAttribute, setAttribute, hasAttribute, removeAttribute, addCss } from './dom';
import registerDoubleclickAdslot from './double-click-ad-slots';
import { parseAttributesIntoValidMapping, getEligibleSizesForResolution } from './size-mapping';

const registerElement = (name = 'as24-ad-slot') => {

    class AS24AdSlot extends HTMLElement {
        attachedCallback () {
            const pageResolution = {
                x: window.innerWidth,
                y: window.innerHeight
            };

            const sizeMapping = parseAttributesIntoValidMapping(this.attributes);
            const eligibleSizes = getEligibleSizesForResolution(sizeMapping, pageResolution);
            const hasEligibleSizes = eligibleSizes && eligibleSizes.length > 0;

            setAttribute(this, 'size-mapping', JSON.stringify(sizeMapping));
            setAttribute(this, 'sizes', JSON.stringify(eligibleSizes));

            if (!hasEligibleSizes) { return; }

            const elementId = getAttribute(this, 'element-id') || `ad-${uuid()}`;
            const adunit = getAttribute(this, 'ad-unit');
            const outOfPage = hasAttribute(this, 'out-of-page');

            const container = document.createElement('div');
            container.id = elementId;
            this.appendChild(container);

            this.adslot = registerDoubleclickAdslot({
                adunit,
                outOfPage,
                sizeMapping,
                container,
                slotElement: this
            });

            this.adslot.onempty = () => setAttribute(this, 'empty', '');
            this.adslot.onload = () => setAttribute(this, 'loaded', '');
            this.adslot.onrefresh = () => {
                removeAttribute(this, 'loaded');
                removeAttribute(this, 'empty');
            };
        }

        detachedCallback() {
            if (this.adslot) {
                this.adslot.destroy();
            }
        }

        refreshAdSlot() {
            if (this.adslot) {
                this.adslot.refresh();
            }
        }
    }

    addCss(`${name}{display:block} ${name}:not([loaded]) div,${name}[empty] div{display:none;}`);
    document.registerElement(name, AS24AdSlot);
};

export default registerElement;
