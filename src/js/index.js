import waitUntilAdsCanBeLoaded from './ads-can-be-loaded';

import registerAdSlotElement from './as24-ad-slot';
import  registerAdTargetingElement, { getTargetingData } from './as24-ad-targeting';
import { gptinit } from './double-click-ad-slots';
import { loadScript, ready as domready } from './dom';

waitUntilAdsCanBeLoaded()
    .then(domready)
    .then(() => {
        gptinit();
        registerAdSlotElement();
        registerAdTargetingElement();

        if (location.search.indexOf('contentbinder=1') >= 0) {
            loadScript('https://s0.2mdn.net/ads/richmedia/studio/mu/templates/backdrop/resources/content_binder.js');
        }
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
    const useOpenX = tld === 'de' || tld === 'at' || tld === 'it' || location.hash.indexOf('ads-use-openx') >= 0;
    const getOpenxUrl = tld => {
        const urls = {
            de: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout',
            at: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-at',
            it: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-it',
            nl: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-nl'
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

        window.OX_cmds = window.OX_cmds || [];
        window.OX_cmds.push(function () {
            var oAR = (window.OX && window.OX.AdRequest);
            if (oAR) {
                window.OX.AdRequest = function () {
                    var ret = oAR.apply(this, arguments);
                    const targeting = getTargetingData('as24-ad-targeting');

                    if (targeting.splz) {
                        this.addVariable('splz', targeting.splz);
                    }

                    if (targeting.zip2) {
                        this.addVariable('zipcode', targeting.zip2);
                    }

                    return ret;
                };

                window.OX.prototype = oAR.prototype;
            }
        });

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
    window.console.warn(e);
});

window.__temp__test__ads__ = 1;
