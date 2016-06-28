(() => {
    'use strict';

    const googletag = window.googletag = window.googletag || { cmd: [] };

    const gtag = () => window.googletag;

    const getAttribute = (el, attr, fallback) => el.getAttribute(attr) || fallback;

    window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads();
        pubads.enableSingleRequest();
        pubads.collapseEmptyDivs(true);
        window.googletag.enableServices();
    });

    window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads();
        setTargeting(pubads);
    });

    const loadDoubleClickAPI = () => {
        // if (loadDoubleClickAPI.done) { return; }
        // loadDoubleClickAPI.done = true;
        const doubleclickApiUrl = 'https://www.googletagservices.com/tag/js/gpt.js';
        const scriptTag = document.querySelector(`script[src="${doubleclickApiUrl}"]`);

        // early return if script alredy loaded
        if (scriptTag) { return; }

        var script = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];
        script.src = doubleclickApiUrl;
        s.parentNode.insertBefore(script, s);
        // loadDoubleClickAPI = () => {};
    };

    const prototype = Object.create(HTMLElement.prototype);

    prototype.attachedCallback = function() {
        // Simple check to disable ads when ads-off is in the URL
        // e.g. example.com/list#ads-off OR example.com/details?ads-off
        if (window.location.href.indexOf('ads-off') >= 0) { return; }

        if (doesScreenResolutionProhibitFillingTheAdSlot(this)) { return; }
        if (isUserDealer()) { return; }

        const slotType = getAttribute(this, 'type', 'doubleclick');

        switch(slotType) {
            case 'doubleclick':
                loadDoubleClickAdSlot(this);
                break;
            default:
                return;
        }
    };

    const loadDoubleClickAdSlot = element => {
        loadDoubleClickAPI();

        const elementId = `${Math.random()}`;
        const slotId = getAttribute(element, 'slot-id');
        const rawSizes = getAttribute(element, 'sizes');
        const rawSizeMapping = getAttribute(element, 'size-mapping');

        if (!slotId) { console.warn('Missing attribute: slot-id parameter must be provided.'); return; }
        if (!rawSizes && !rawSizeMapping) { console.warn('Missing attribute: either sizes or size-mapping must be provided.'); return; }

        var sizes, sizeMapping;

        try {
            sizes = JSON.parse(rawSizes || '[]');
            sizeMapping = JSON.parse(rawSizeMapping || '[]');
        } catch(ex) {
            console.warn('Invalid attribute: either sizes or size-mapping attribute cannot be JSON-parsed.');
            return;
        }

        if (!sizes.length && sizeMapping.length) {
            sizes = [];
            sizeMapping.forEach(mapping => {
                sizes = sizes.concat(mapping[1]);
            });

            element.setAttribute('sizes', JSON.stringify(sizes));
        }

        element.innerHTML = `<div id="${elementId}"></div>`;

        googletag.cmd.push(() => {
            const pubads = window.googletag.pubads();

            pubads.enableSingleRequest();
            window.googletag.defineSlot(slotId, sizes, elementId).defineSizeMapping(sizeMapping).addService(window.googletag.pubads());

            setTimeout(() => {
                window.googletag.display(elementId);
            });
        });
    };

    const noCookieConsentNeededAndNotGivenYet = {
        const host = location.hostname;
        const cookieConsentNeeded = /\.nl$/.test(host) || /\.it$/.test(host) || location.hash.indexOf('cookie-consent-needed') >= 0;
        const cookieConsentGiven = document.cookie.indexOf('cookieConsent=1;') >= 0;
        return cookieConsentNeeded && !cookieConsentGiven;
    };

    const doesScreenResolutionProhibitFillingTheAdSlot = el => {
        const pageResolution = {
            x: window.innerWidth,
            y: window.innerHeight
        };

        const minX = el.getAttribute('min-x-resolution') || 0;
        const maxX = el.getAttribute('max-x-resolution') || 1000000;
        const minY = el.getAttribute('min-y-resolution') || 0;
        const maxY = el.getAttribute('max-y-resolution') || 1000000;

        return minX > pageResolution.x || maxX < pageResolution.x || minY > pageResolution.y || maxY < pageResolution.y;
    };

    const isUserDealer = () => document.cookie.indexOf('CustomerType=D') > 0;

    const setTargeting = pubads => {
        const targeting = JSON.parse(document.querySelector('[type="adtargeting/json"]').textContent || '{}');

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

    // const domready = fn => {
    //     if (document.readyState !== 'loading') {
    //         return setTimeout(fn);
    //     }
    //
    //     document.addEventListener("DOMContentLoaded", fn);
    // };

})();
