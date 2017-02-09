import waitUntilAdsCanBeLoaded from './ads-can-be-loaded';

import registerAdSlotElement from './as24-ad-slot';
import registerAdTargetingElement from './as24-ad-targeting';
import { gptinit } from './double-click-ad-slots';
import { loadScript, ready as domready } from './dom';

waitUntilAdsCanBeLoaded()
    .then(domready)
    .then(() => {
        gptinit();
        registerAdSlotElement();
        registerAdTargetingElement();
    })
    // .then(() => {
    //     const configElement = document.querySelector('as24-ad-config');
    //     const config = {};
    //     Array.from(configElement.attributes).forEach(x => {
    //         config[x.nodeName] = x.nodeValue;
    //     });

//     return config;
// })
.then(() => {
    const tld = location.hostname.split('.').pop();
    const useOpenX = tld === 'de' || tld === 'at' || location.hash.indexOf('ads-use-openx') >= 0;
    const getOpenxUrl = tld => {
        const urls = {
            de: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout',
            at: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-at'
        };

        return urls[tld] || urls['de'];
    };

    if (!useOpenX) {
        loadScript('https://www.googletagservices.com/tag/js/gpt.js');
    }

    if (useOpenX) {
        const convertSizes = sizes => {
            return JSON.parse(sizes).filter(x => Array.isArray(x) && x.length === 2).map(x => x.join('x'));
        };

        const activeSlots = Array.from(document.querySelectorAll('as24-ad-slot[sizes]:not([sizes="[]"]):not([out-of-page]):not([immediate]):not([openx-ignore])'));

        window.OX_dfp_ads = activeSlots.map(element => [element.getAttribute('ad-unit'), convertSizes(element.getAttribute('sizes')), element.children[0].id]);
        loadScript(getOpenxUrl(tld));

        var oxTimeout;
        const oxCallback = () => {
            clearTimeout(oxTimeout);
            loadScript('https://www.googletagservices.com/tag/js/gpt.js');
        };

        oxTimeout = setTimeout(oxCallback, 3000);
        window.OX_dfp_options = { callback: oxCallback };
    }
})
.catch(e => {
    console.warn(e);
});

window.__temp__test__ads__ = 1;
