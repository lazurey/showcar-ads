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

                if (!hasEligibleSizes) {
                    setAttribute(this, 'empty', '');
                    this.dispatchEvent(new Event('ad-slot-empty'), { bubbles: true });

                    return;
                }

                const elementId = getAttribute(this, 'element-id') || `ad-${uuid()}`;
                const adunit = getAttribute(this, 'ad-unit');
                const outOfPage = hasAttribute(this, 'out-of-page');
                const immediate = hasAttribute(this, 'immediate');

                const container = document.createElement('div');
                container.id = elementId;
                this.appendChild(container);

                const minHeight = Math.min(...(eligibleSizes.filter(s => s !== 'fluid').map(s => s[1])));

                this.style.minHeight = `${minHeight}px`;

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
                    this.className += ` rnd-${ (Math.random() * 10000) | 0 }`; // this causes redraw in IE, because attribute change doesn't
                    this.dispatchEvent(new Event('ad-slot-loaded'), { bubbles: true });

                    const oldMinHeight = parseInt(this.style.minHeight, 10);
                    const height = this.clientHeight;
                    this.style.minHeight = `${Math.max(oldMinHeight, height)}px`;
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

    addCss(`${name}:not([out-of-page]){display: block; background-color: #E0E0E0; background-image: url(data:image/svg+xml;charset=utf-8,%3Csvg%20id%3D%22Ebene_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22141.7%22%20height%3D%2270.7%22%20viewBox%3D%220%200%20141.7%2070.7%22%3E%3Cstyle%3E%3C%21%5BCDATA%5B%0D%0A%09.st0%7Bfill%3A%23FFFFFF%3B%7D%0D%0A%5D%5D%3E%3C%2Fstyle%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M2.2%2030.7v8.4h137.3v-8.4H2.2z%22%2F%3E%3Cpath%20d%3D%22M0%200v70.7h123.3c10.1%200%2018.4-8.2%2018.4-18.3V0H0z%22%2F%3E%3Cpath%20d%3D%22M2.2%202.2v33.1h137.3V2.2H2.2z%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M2.2%2068.5h121.1c9%200%2016.2-7.4%2016.2-16V35.3H2.2v33.2z%22%2F%3E%3Cpath%20d%3D%22M14.7%2061.4h-.2c-2.8%200-5.2-1.9-5.2-5.2%200-2%203-2%203%200%200%201.4.9%202.2%202.2%202.2h.2c1.3%200%202.3-.7%202.3-2%200-3.2-7.5-3.5-7.5-8.3v-.5c0-2.8%202.8-4.4%205-4.4h.2c2.7%200%205%201.7%205%204.1%200%201.9-3%202-3%20.1%200-.7-.8-1.2-2.1-1.2h-.2c-1.1%200-2%20.6-2%201.6v.4c0%202%207.5%202.9%207.5%208.3.1%202.9-2.2%204.9-5.2%204.9zM27.7%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8.1c0-2.9%202.3-5%205.2-5h.2c2.6%200%204.8%201.8%205.1%204.3v.3c0%20.9-.8%201.4-1.5%201.4s-1.3-.4-1.4-1.3c-.2-1.1-1.1-1.8-2.2-1.8h-.2c-1.2%200-2.2.9-2.2%202.1v8.1c0%201.2%201%202.1%202.2%202.1h.2c1.1%200%202-.7%202.2-1.8.1-.9.8-1.3%201.4-1.3.8%200%201.5.5%201.5%201.4v.3c-.3%202.6-2.5%204.4-5.1%204.4zM40.4%2061.4h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c-.1%202.9-2.4%205.1-5.2%205.1zm2.2-13.1c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1h.2c1.2%200%202.2-.9%202.2-2.1v-8zM54%2061.4h-.2c-2.8%200-5.2-2.3-5.2-5.2V44.8c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V44.8c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v11.5c0%202.8-2.3%205.1-5.2%205.1zM69.8%2046.4h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V46.4h-2.1c-1%200-1.5-.7-1.5-1.5%200-.7.5-1.5%201.5-1.5h7.1c1%200%201.5.7%201.5%201.5.1.7-.4%201.5-1.4%201.5zM83.7%2061.2H77c-1%200-1.5-.9-1.5-1.8%200-.3.1-.6.2-.9l5.9-9.4c.3-.5.3-.8.3-1.2v-.2c0-.8-.7-1.5-1.5-1.5h-.1c-.9%200-1.5.7-1.5%201.5v.3c0%201-.8%201.5-1.5%201.5s-1.5-.5-1.5-1.5v-.4c0-2.5%202-4.3%204.5-4.3h.1c2.4%200%204.5%201.8%204.5%204.3v.3c0%201-.4%201.8-.9%202.7l-4.7%207.7h4.5c1%200%201.5.7%201.5%201.5-.1.7-.6%201.4-1.6%201.4zM95.5%2057.7h-.6v2.2c0%201-.7%201.5-1.5%201.5s-1.4-.5-1.4-1.5v-2.2h-4.1c-1%200-1.7-.6-1.7-1.6%200-.3.1-.6.2-.8l4.8-11.2c.3-.6.8-.9%201.3-.9.8%200%201.5.6%201.5%201.4%200%20.2%200%20.4-.1.6l-4.3%209.4H92v-1.5c0-1%20.7-1.5%201.5-1.5s1.5.5%201.5%201.5v1.5h.6c1%200%201.5.7%201.5%201.5s-.6%201.6-1.6%201.6z%22%2F%3E%3Cpath%20class%3D%22st0%22%20d%3D%22M21.1%2027.2c-.6%200-1.2-.3-1.4-1.1l-1-3.1h-5.1l-1%203.1c-.2.7-.8%201.1-1.4%201.1-.8%200-1.5-.6-1.5-1.4%200-.2%200-.3.1-.5l4.7-14.9c.4-1.2%201-1.3%201.7-1.3.6%200%201.3.1%201.7%201.3l4.7%2014.9c.1.2.1.3.1.5%200%20.9-.8%201.4-1.6%201.4zm-4.8-12.6L14.7%2020H18l-1.7-5.4zM30.2%2027.2H30c-2.8%200-5.2-2.3-5.2-5.2V10.6c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%201.2%201%202.2%202.2%202.2h.2c1.2%200%202.2-1%202.2-2.2V10.6c0-1%20.7-1.5%201.5-1.5.7%200%201.5.5%201.5%201.5v11.5c0%202.8-2.3%205.1-5.2%205.1zM46.2%2012.2h-2.1v13.5c0%201-.7%201.5-1.5%201.5-.7%200-1.5-.5-1.5-1.5V12.2H39c-1%200-1.5-.7-1.5-1.5%200-.7.5-1.5%201.5-1.5h7.1c1%200%201.5.7%201.5%201.5.1.8-.4%201.5-1.4%201.5zM54.9%2027.2h-.2c-2.8%200-5.2-2.2-5.2-5.1v-8c0-2.9%202.3-5.1%205.2-5.1h.2c2.9%200%205.2%202.2%205.2%205.1v8c-.1%202.9-2.4%205.1-5.2%205.1zm2.2-13c0-1.2-1-2.1-2.2-2.1h-.2c-1.2%200-2.2.9-2.2%202.1v8c0%201.2%201%202.1%202.2%202.1h.2c1.2%200%202.2-.9%202.2-2.1v-8z%22%2F%3E%3C%2Fsvg%3E); background-position: center center; background-repeat: no-repeat;}`);
    document.registerElement(name, { prototype: AS24AdSlotPrototype });
};

export default registerElement;
