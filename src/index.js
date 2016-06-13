(() => {
    'use strict';

    const googletag = window.googletag = window.googletag || {};
    googletag.cmd = googletag.cmd || [];

    const pageResolution = {
        x: window.innerWidth,
        y: window.innerHeight
    };

    const getAttribute = (el, attr, fallback) => HTMLElement.prototype.getAttribute.call(el, attr) || fallback;

    var loadDoubleClickAPI = _ => {
        var script = document.createElement('script');
        var s = document.getElementsByTagName('script')[0];
        script.src = 'https://www.googletagservices.com/tag/js/gpt.js';
        s.parentNode.insertBefore(script, s);

        // prevent loading the library more than once
        // loadDoubleClickAPI = () => {};
    };

    const prototype = Object.create(HTMLElement.prototype);

    prototype.attachedCallback = function() {
        loadDoubleClickAPI();

        const minX = this.getAttribute('min-x-resolution') || 0;
        if (minX > pageResolution.x) { return; }

        const type = getAttribute(this, 'type', 'doubleclick');
        if (type !== 'doubleclick') { return; }

        const elementId = getAttribute(this, 'element-id', `${Math.random()}`);
        const slotId = getAttribute(this, 'slot-id');
        const sizes = JSON.parse(getAttribute(this, 'sizes', '[]'));
        const sizeMapping = JSON.parse(getAttribute(this, 'size-mapping', '[]'));

        this.innerHTML = `<div id="${elementId}"></div>`;

        this.setAttribute('element-id', elementId);

        googletag.cmd.push(_ => {
            const adslot = googletag.defineSlot(slotId, sizes, elementId);
            adslot.defineSizeMapping(sizeMapping);
            adslot.addService(googletag.pubads());
            googletag.display(elementId);
        });
    };

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

    googletag.cmd.push(_ => {
        const pubads = window.googletag.pubads();
        setTargeting(pubads);

        // pubads.setForceSafeFrame(true);
        pubads.enableSingleRequest();
        pubads.collapseEmptyDivs(true);
        googletag.enableServices();
    });

    document.registerElement('as24-ad-slot', { prototype });

    const domready = fn => {
        if (document.readyState !== 'loading') {
            return setTimeout(fn);
        }

        document.addEventListener("DOMContentLoaded", fn);
    };

    // domready(x => console.log('ready'));
})();
