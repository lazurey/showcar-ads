import uuid from './uuid';
import { getAttribute, setAttribute, hasAttribute, removeAttribute, addCss } from './dom';
import registerDoubleclickAdslot from './double-click-ad-slots';
import { parseAttributesIntoValidMapping, getEligibleSizesForResolution } from './size-mapping';

const registerElement = (name = 'as24-ad-slot') => {

    const AS24AdSlotPrototype = Object.create(HTMLElement.prototype, {
        attachedCallback: {
            value: function() {
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
                const immediate = hasAttribute(this, 'immediate');

                const container = document.createElement('div');
                container.id = elementId;
                this.appendChild(container);

                this.adslot = registerDoubleclickAdslot({
                    adunit,
                    outOfPage,
                    sizeMapping,
                    container,
                    slotElement: this,
                    immediate
                });

                this.adslot.onempty = () => {
                    setAttribute(this, 'empty', '');
                    this.dispatchEvent(new Event('ad-slot-empty'), { bubbles: true });
                };

                this.adslot.onload = () => {
                    setAttribute(this, 'loaded', '');
                    this.dispatchEvent(new Event('ad-slot-loaded'), { bubbles: true });
                };

                this.adslot.onrefresh = () => {
                    removeAttribute(this, 'loaded');
                    removeAttribute(this, 'empty');
                };
            }
        },

        detachedCallback: {
            value: function() {
                if (this.adslot) {
                    this.adslot.destroy();
                }
            }
        },

        refreshAdSlot: {
            value: function() {
                if (this.adslot) {
                    this.adslot.refresh();
                }
            }
        }
    });

    addCss(`${name}{display:block} ${name}:not([loaded]) div,${name}[empty] div{display:none;}`);
    document.registerElement(name, { prototype: AS24AdSlotPrototype });
};

export default registerElement;
