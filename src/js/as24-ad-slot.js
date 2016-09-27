import uuid from './uuid';
import { getAttribute, setAttribute, hasAttribute, removeAttribute, addCss } from './dom';
import registerDoubleclickAdslot from './double-click-ad-slots';
import { parseAttributesIntoValidMapping, mappingHasSizesForResolution } from './size-mapping';

const registerElement = (name = 'as24-ad-slot') => {

    class AS24AdSlot extends HTMLElement {
        attachedCallback () {
            const element = this;

            const pageResolution = {
                x: window.innerWidth,
                y: window.innerHeight
            };

            const sizeMapping = parseAttributesIntoValidMapping(element.attributes);
            const hasEligibleSizes = mappingHasSizesForResolution(sizeMapping, pageResolution);

            setAttribute(element, 'size-mapping', JSON.stringify(sizeMapping));

            if (!hasEligibleSizes) { return; }

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
