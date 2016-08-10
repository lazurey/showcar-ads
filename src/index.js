import { hasAttribute, getAttribute, loadScript, domready } from './helpers.js';

(() => {
    'use strict';

    window.googletag = window.googletag || { cmd: [] };

    // Simple check to disable ads when ads-off is in the URL
    // e.g. example.com/list#ads-off OR example.com/details?ads-off
    if (window.location.href.indexOf('ads-off=true') >= 0) { return; }

    const isUserDealer = () => document.cookie.indexOf('CustomerType=D') > 0;
    if (isUserDealer()) { return; }

    const cookieConsentNeededAndNotGivenYet = () => {
        const host = location.hostname;
        const cookieConsentNeeded = /\.nl$/.test(host) || /\.it$/.test(host) || (location.hash.indexOf('cookie-consent-needed') >= 0);
        const cookieConsentGiven = document.cookie.indexOf('cookieConsent=1;') >= 0;
        return cookieConsentNeeded && !cookieConsentGiven;
    };

    if (cookieConsentNeededAndNotGivenYet()) {
        // window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }))
        window.addEventListener('cookie-consent-given', start);
        return;
    }

    // creating styles to hide
    const style = document.createElement('style');
    style.innerHTML = 'as24-ad-targeting{display:none}';
    document.head.appendChild(style);

    start();

    function start() {
        const googletag = window.googletag;

        loadScript('https://www.googletagservices.com/tag/js/gpt.js');

        googletag.cmd.push(() => {
            const pubads = googletag.pubads();
            pubads.enableSingleRequest();
            pubads.collapseEmptyDivs(true);
            pubads.disableInitialLoad();

            // pubads.addEventListener('slotRenderEnded', function(event) {
            //     document.dispatchEvent(new CustomEvent('as24-ad-slot:slotRenderEnded', {detail: event}));
            // });
            setTargeting(pubads);
            googletag.enableServices();
        });

        // document.addEventListener('as24-ad-slots:refresh', (event) => {
        //     googletag.cmd.push(() => {
        //         const pubads = googletag.pubads();
        //         setTargeting(pubads);
        //
        //         if (event && event.detail) {
        //             const adunits = event.detail;
        //             var slots = adslots.filter(function(slot) {
        //                 return (adunits.indexOf(slot.G) >= 0);
        //             });
        //
        //             if (slots.length > 0) {
        //                 pubads.refresh(slots);
        //             }
        //         } else {
        //             pubads.refresh();
        //         }
        //     });
        // });

        const prototype = Object.create(HTMLElement.prototype);

        // Is called when custom element is added to the page
        prototype.attachedCallback = function() {
            if (doesScreenResolutionProhibitFillingTheAdSlot(this)) { return; }

            const slotType = getAttribute(this, 'type', 'doubleclick');

            switch(slotType) {
                case 'doubleclick':
                    loadDoubleClickAdSlot(this);
                    break;
                default:
                    return;
            }
        };

        var adslots = [];

        // Is called when custom element is removed from the page
        prototype.detachedCallback = function() {
            const detachedAdSlotUnit = getAttribute(this, 'ad-unit');

            for (var slot of adslots) {
                if (slot.G === detachedAdSlotUnit) {
                    googletag.destroySlots([slot]);
                }
            }
        };

        const isElementInViewport = element => {
            const rect = element.getBoundingClientRect();
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            const isOutOfWindow = rect.bottom < scrollY || rect.top > scrollY + windowHeight;
            return !isOutOfWindow;
        };

        const loadDoubleClickAdSlot = element => {
            const elementId = getAttribute(element, 'element-id') || `${Math.random()}`;
            const adunit = getAttribute(element, 'ad-unit');
            const rawSizes = getAttribute(element, 'sizes');
            const rawSizeMapping = getAttribute(element, 'size-mapping');
            const outOfPage = hasAttribute(element, 'out-of-page');

            if (!adunit) { console.warn('Missing attribute: ad-unit parameter must be provided.'); return; }
            if (!outOfPage && !rawSizes && !rawSizeMapping) { console.warn('Missing attribute: either sizes or size-mapping must be provided.'); return; }

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
                        ? googletag.defineOutOfPageSlot(adunit, elementId).setCollapseEmptyDiv(true).addService(googletag.pubads())
                        : googletag.defineSlot(adunit, sizes, elementId).defineSizeMapping(sizeMapping).setCollapseEmptyDiv(true).addService(googletag.pubads());

                setTimeout(() => {
                    googletag.display(elementId);
                    // console.log('display', elementId);
                    // if (isElementInViewport(element)) {
                        googletag.pubads().refresh([element.gptAdSlot], { changeCorrelator: false });
                        // console.log('refresh', elementId);
                    // }
                });
            });
        };

        const doesScreenResolutionProhibitFillingTheAdSlot = el => {
            const pageResolution = {
                x: window.innerWidth,
                y: window.innerHeight
            };

            const minX = getAttribute(el, 'min-x-resolution', 0);
            const maxX = getAttribute(el, 'max-x-resolution', Infinity);
            const minY = getAttribute(el, 'min-y-resolution', 0);
            const maxY = getAttribute(el, 'max-y-resolution', Infinity);
            const resolutionRanges = getAttribute(el, 'resolution-ranges', '');

            if(resolutionRanges.length > 0) {
                const rangeArray = JSON.parse(resolutionRanges);
                for(var i = 0; i < rangeArray.length; i++){
                    var min = rangeArray[i][0] || 0;
                    var max = rangeArray[i][1] || 8192;
                    if ((pageResolution.x >= min) && (pageResolution.x <= max)) {
                        return false;
                        break;
                    }
                }
                return true;
            }

            return minX > pageResolution.x || maxX < pageResolution.x || minY > pageResolution.y || maxY < pageResolution.y;
        };

        const extend = (target, source) => {
            for (var key in source) {
                target[key] = source[key];
            }
            return target;
        };

        const setTargeting = pubads => {
            const targetingElements = Array.prototype.slice.call(document.querySelectorAll('as24-ad-targeting'));
            const targeting = targetingElements.map(el => JSON.parse(el.innerHTML || '{}')).reduce(extend, {});

            const matches = location.search.match(/test=([^&]*)/);
            if (matches && matches.length >= 2) {
                targeting.test = matches[1];
            }

            for (let key in targeting) {
                const value = `${targeting[key]}`.split(',');
                pubads.setTargeting(key, value);
            }
        };

        try {
            document.registerElement('as24-ad-slot', { prototype });
        } catch(ex) {
            console.warn('Custom element already registered: "as24-ad-slot".');
        }
    }

    // const showVisibleAds = () => {
    //     console.log('showVisibleAds');
    // };
    //
    // window.addEventListener('scroll', showVisibleAds);
    // domready(showVisibleAds);
})();
