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

        loadDoubleClickAPI();

        const googletag = () => window.googletag;

        const getAttribute = (el, attr, fallback) => el.getAttribute(attr) || fallback;

        googletag().cmd.push(() => {
            const pubads = googletag().pubads();
            pubads.enableSingleRequest();
            pubads.collapseEmptyDivs(true);
        console.log('slotRenderEnded Evet registration');
            pubads.addEventListener('slotRenderEnded', function(event) {
                console.log('Call slotRenderEnded');
                document.dispatchEvent(new CustomEvent('as24-ad-slot:slotRenderEnded', {detail: event}));
            });
            googletag().enableServices();
        });
        document.addEventListener('as24-ad-slot:slotRenderEnded', function() {
           console.log('slotRenderEnded callback');
        });

        googletag().cmd.push(() => {
            const pubads = googletag().pubads();
            setTargeting(pubads);
        });

        const prototype = Object.create(HTMLElement.prototype);

        prototype.attachedCallback = function() {
            if (doesScreenResolutionProhibitFillingTheAdSlot(this)) { this.style.display = 'none'; return; }

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
            const elementId = getAttribute(element, 'element-id') || `${Math.random()}`;
            const adunit = getAttribute(element, 'ad-unit');
            const cssClass = getAttribute(element, 'css-class', '');
            const rawSizes = getAttribute(element, 'sizes');
            const rawSizeMapping = getAttribute(element, 'size-mapping');

            if (!adunit) { console.warn('Missing attribute: ad-unit parameter must be provided.'); return; }
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

            var adContainer = document.createElement('div');
            adContainer.id = elementId;
            if(cssClass.length > 0) {
                adContainer.className = cssClass;
            }
            element.appendChild(adContainer);

            googletag().cmd.push(() => {
                const pubads = googletag().pubads();

                if(!document.getElementById(elementId)) {
                    console.warn('Ad container div was not available.');
                    element.style.display = 'none';
                    return;
                }

                // pubads.enableSingleRequest();
                googletag().defineSlot(adunit, sizes, elementId).defineSizeMapping(sizeMapping).addService(googletag().pubads());

                setTimeout(() => {
                    googletag().display(elementId);
                });
            });
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
            const resolutionRanges = el.getAttribute('resolution-ranges') || '';

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

    // const domready = fn => {
    //     if (document.readyState !== 'loading') {
    //         return setTimeout(fn);
    //     }
    //
    //     document.addEventListener("DOMContentLoaded", fn);
    // };

})();
