import { once, adsAreDisabled, batch, debounce } from './helpers.js';

import * as cookie from './cookie.js';
import * as dom from './dom.js';

import { hasAttribute, getAttribute, setAttribute, removeAttribute, loadScript, ready as domready } from './dom.js';

// import start from './start';

(() => {

    // return;

    const s = document.createElement('style');
    s.innerHTML = 'as24-ad-slot[empty] div, as24-ad-slot:not([loaded]) div { display: none !important; }';
    document.head.appendChild(s);

    const googletag = window.googletag = window.googletag || { cmd: [] };

    if (adsAreDisabled() || cookie.isUserDealer()) { return; }

    if (cookie.consentNeededAndNotGivenYet()) {
        // waiting for cookie-consent-given event
        // i.e. window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }))
        return window.addEventListener('cookie-consent-given', start);
    }

    start();

    function start() {

        loadScript('https://www.googletagservices.com/tag/js/gpt.js');

        const batchRefresh = batch(slots => {
            googletag.cmd.push(() => {
                // googletag.pubads().refresh(slots, { changeCorrelator: false });
                googletag.pubads().refresh(slots);
            });
        });

        let slotsToRefreshWhenInViewport = [];
        const rfr = () => {
            slotsToRefreshWhenInViewport.forEach(slot => {
                if (dom.isElementInViewport(slot)) {
                    slot.refreshAdSlot();
                }
            });
        };

        const debouncedRfr = debounce(rfr, 50);

        window.addEventListener('scroll', debouncedRfr);
        dom.ready(debouncedRfr);

        googletag.cmd.push(() => {
            const pubads = googletag.pubads();

            pubads.addEventListener('slotOnload', eventData => {
                const element = document.querySelector(`#${eventData.slot.getSlotElementId()}`);
                if (!element) { return; }

                const iframe = element.querySelector('iframe');
                if (!iframe) { return; }

                const style = window.getComputedStyle(iframe);
                const slotElement = element.parentNode;

                if (style.display === 'none') {
                    setAttribute(slotElement, 'empty', '');
                }

                setAttribute(slotElement, 'loaded', '');
            });

            pubads.addEventListener('slotRenderEnded', eventData => {
                const element = document.querySelector(`#${eventData.slot.getSlotElementId()}`);

                if (element && eventData.isEmpty) {
                    const slotElement = element.parentNode;
                    setAttribute(slotElement, 'empty', '');
                }
            });

            pubads.enableSingleRequest();
            pubads.collapseEmptyDivs(true);
            pubads.disableInitialLoad();
            // pubads.enableAsyncRendering(); // TODO: check this
            googletag.enableServices();
        });

        const prototype = Object.create(HTMLElement.prototype);

        prototype.attachedCallback = function() {
            const slotType = getAttribute(this, 'type', 'doubleclick');

            switch(slotType) {
                case 'doubleclick':
                    loadDoubleClickAdSlot(this);
                    break;
                default:
                    return;
            }
        };

        prototype.detachedCallback = function() {
            if (this.gptAdSlot) {
                googletag.cmd.push(() => {
                    googletag.destroySlots([this.gptAdSlot]);
                    this.gptAdSlot = undefined;
                });
            }
        };

        prototype.refreshAdSlot = function() {
            slotsToRefreshWhenInViewport = slotsToRefreshWhenInViewport.filter(s => s !== this);
            removeAttribute(this, 'loaded');
            removeAttribute(this, 'empty');
            batchRefresh(this.gptAdSlot);
        };

        const loadDoubleClickAdSlot = element => {
            const elementId = getAttribute(element, 'element-id') || `ad-slot-element-${Math.random() * 1000000 | 0}`;
            const adunit = getAttribute(element, 'ad-unit');
            const outOfPage = hasAttribute(element, 'out-of-page');

            const parseResolution = str => {
                const matches = str.replace(/[\s]/g, '').match(/([\d]+)x([\d]+)/i);

                if (matches && matches[2]) {
                    return [matches[1] | 0, matches[2] | 0];
                }

                return null;
            };

            const sizeMaps = [].slice.call(element.attributes).filter(x => /size-map-/.test(x.nodeName)).map(x => ({ name: x.nodeName, value: x.value }));

            if (sizeMaps.length > 0) {

                const parsedSizeMaps = sizeMaps.map(m => {
                    return [parseResolution(m.name), m.value.split(',').map(parseResolution).filter(r => r && r[0] && r[1])];
                });

                parsedSizeMaps.sort((a, b) => {
                    const ax = a[0][0];
                    const ay = a[0][1];

                    const bx = b[0][0];
                    const by = b[0][1];

                    if (ax === bx) { return ay - by };
                    return bx - ax;
                });

                const smallest = parsedSizeMaps[parsedSizeMaps.length - 1];
                if (smallest[0][0] !== 0 || smallest[0][1] !== 0) {
                    parsedSizeMaps.push([[0,0],[]])
                }

                setAttribute(element, 'size-mapping', JSON.stringify(parsedSizeMaps));

                const pageResolution = {
                    x: window.innerWidth,
                    y: window.innerHeight
                };

                for (let i = 0; i < parsedSizeMaps.length; i++) {
                    const m = parsedSizeMaps[i];
                    const q = pageResolution.x >= m[0][0] && pageResolution.y >= m[0][1];

                    if (q) {
                        const sizes = m[1];

                        if (sizes.length <= 0) {
                            // Not showing ad slot due to size map restrictions.
                            return;
                        }

                        break;
                    }
                }
            }

            const rawSizes = getAttribute(element, 'sizes');
            const rawSizeMapping = getAttribute(element, 'size-mapping');

            if (!adunit) { console.warn('Missing attribute: ad-unit parameter must be provided.'); return; }
            if (!outOfPage && !rawSizes && !rawSizeMapping) { console.warn('Missing attribute: either sizes or size-mapping must be provided if not out-of-page ad slot.'); return; }

            var sizes, sizeMapping;

            try {
                sizes = JSON.parse(rawSizes || '[]');
                sizeMapping = JSON.parse(rawSizeMapping || '[]');
            } catch(ex) {
                console.warn('Invalid attribute: either sizes or size-mapping attribute cannot be JSON-parsed.');
                return;
            }

            var adContainer = document.createElement('div');
            adContainer.id = elementId;

            element.appendChild(adContainer);

            googletag.cmd.push(() => {
                if (!document.body.contains(element)) {
                    console.warn('Ad container div was not available.');
                    return;
                }

                element.gptAdSlot = outOfPage
                        ? googletag.defineOutOfPageSlot(adunit, elementId).addService(googletag.pubads())
                        : googletag.defineSlot(adunit, sizes, elementId).defineSizeMapping(sizeMapping).addService(googletag.pubads());

                googletag.display(elementId);

                if (dom.isElementInViewport(element) || outOfPage) {
                    element.refreshAdSlot();
                } else {
                    slotsToRefreshWhenInViewport.push(element);
                }
            });
        };

        try {
            dom.addCss('as24-ad-slot{display:block}');
            document.registerElement('as24-ad-slot', { prototype });
        } catch(ex) {
            console.warn('Custom element already registered: "as24-ad-slot".');
        }

        const x = Object.assign(Object.create(HTMLElement.prototype), {
            attachedCallback() {
                const targetingElements = Array.from(document.querySelectorAll('as24-ad-targeting'));
                const targetingObjects = targetingElements.map(el => JSON.parse(el.innerHTML.trim() || '{}'));
                const targeting = {};

                targetingObjects.forEach(obj => Object.assign(targeting, obj));

                googletag.cmd.push(() => {
                    const pubads = googletag.pubads();
                    const oldTargetingKeys = googletag.pubads().getTargetingKeys();

                    oldTargetingKeys.forEach(key => pubads.clearTargeting(key));

                    for (let key in targeting) {
                        const value = `${targeting[key]}`.split(',');
                        pubads.setTargeting(key, value);
                    }

                    if (window.Krux) {
                        pubads.setTargeting('ksg', window.Krux.segments);
                        pubads.setTargeting('kuid', window.Krux.user);
                    }
                });
            }
        });

        try {
            document.registerElement('as24-ad-targeting', { prototype: x });
        } catch(ex) {
            console.warn('Custom element already registered: "as24-ad-targeting".');
        }
    }

    // performance.getEntriesByType("resource").filter(x => /gpt/.test(x.name))

    // var ln = document.createElement('link');
    // ln.rel = 'preload';
    // ln.rel = 'prefetch';
    // ln.href = 'https://www.googletagservices.com/tag/js/gpt.js';
    // ln.href = 'https://partner.googleadservices.com/gpt/pubads_impl_93.js';
    // // ln.href = 'https://partner.googleadservices.com/';
    // ln.onerror = e => console.log('ERROR', e);
    //
    // document.head.appendChild(ln);

    // setTimeout(() => {
    //     const div = document.createElement('div');
    //     div.id = 'adblockdetect';
    //     div.className = 'pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
    //     div.style = 'width: 1px !important; height: 1px !important; position: absolute !important; left: -10000px !important; top: -1000px !important;';
    //     document.body.appendChild(div);
    //
    //     setInterval(() => {
    //         if (window.document.body.getAttribute('abp') !== null
    //     		|| div.offsetParent === null
    //     		|| div.offsetHeight == 0
    //     		|| div.offsetLeft == 0
    //     		|| div.offsetTop == 0
    //     		|| div.offsetWidth == 0
    //     		|| div.clientHeight == 0
    //     		|| div.clientWidth == 0
    //             || window.getComputedStyle(div).getPropertyValue('display') === 'none'
    //             || window.getComputedStyle(div).getPropertyValue('visibility') === 'hidden') {
    //
    //                 console.log('Ad blocker detected');
    //
	// 	      } else  {
    //               console.log('No ab');
    //           }
    //     }, 1000);
    // }, 100);

})();
