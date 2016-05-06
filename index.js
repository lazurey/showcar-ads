'use strict';
window.googletag = window.googletag || {};
window.googletag.cmd = window.googletag.cmd || [];

const pageResolution = {
    x: window.innerWidth,
    y: window.innerHeight
};

const getAttribute = (el, attr, fallback) => HTMLElement.prototype.getAttribute.call(el, attr) || fallback;

const loadScriptAsync = url => {
    var script = document.createElement('script');
    script.async = true;
    script.src = url;
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
};

const loadDoubleClickAPI = _ => {
    loadScriptAsync('https://www.googletagservices.com/tag/js/gpt.js')
};

const prototype = Object.create(HTMLElement.prototype);
prototype.attachedCallback = function() {
    const minX = this.getAttribute('min-x-resolution') || 0;
    if (minX > pageResolution.x) { return; }

    const type = getAttribute(this, 'type', 'doubleclick');
    if (type !== 'doubleclick') { return; }

    const elementId = getAttribute(this, 'element-id', `${Math.random()}`);
    const slotId = getAttribute(this, 'slot-id');
    const sizes = JSON.parse(getAttribute(this, 'sizes', '[]'));
    const sizeMapping = JSON.parse(getAttribute(this, 'size-mapping', '[]'));

    this.innerHTML = `<!-- ${slotId} --><div id="${elementId}"></div>`;

    this.setAttribute('element-id', elementId);

    window.googletag.cmd.push(_ => {
        const adslot = window.googletag.defineSlot(slotId, sizes, elementId);
        adslot.addService(window.googletag.pubads());
        adslot.defineSizeMapping(sizeMapping);
        googletag.display(elementId);
    });
};

loadDoubleClickAPI();

window.googletag.cmd.push(_ => {
    const pubads = window.googletag.pubads();
    // pubads.setForceSafeFrame(true);

    const targeting = JSON.parse(document.querySelector('[type="adtargeting/json"]').textContent || '{}');

    for (let key in targeting) {
        try {
        const value = `${targeting[key]}`.split(',');
        pubads.setTargeting(key, value);
        } catch(ex) {
            console.warn(ex);
        }
    }


    pubads.setTargeting('test', 'adtagsmobile')
    pubads.enableSingleRequest();
    pubads.collapseEmptyDivs(true);
    googletag.enableServices();
});

document.registerElement('as24-ad-slot', { prototype });
