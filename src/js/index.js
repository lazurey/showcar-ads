import waitUntilAdsCanBeLoaded from './ads-can-be-loaded';

import registerAdSlotElement from './as24-ad-slot';
import registerAdTargetingElement from './as24-ad-targeting';
import { gptinit } from './double-click-ad-slots';
import { loadScript, ready } from './dom';

waitUntilAdsCanBeLoaded()
    .then(() => {
        const tld = location.hostname.split('.').pop();
        const useOpenX = tld === 'de' || tld === 'at' || location.hash.indexOf('ads-use-openx') >= 0;
        const getOpenxUrl = tld => {
            // TODO: for OpenX use ad config instead of hard-coding values
            // <as24-ad-config openx-src="https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout" use-openx="true"></as24-ad-config>
            const urls = {
                de: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout',
                at: 'https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout-at'
            };

            return urls[tld] || urls['de'];
        };

        if (!useOpenX) {
            loadScript('https://www.googletagservices.com/tag/js/gpt.js');
        }

        ready(() => {
            gptinit();
            registerAdSlotElement();
            registerAdTargetingElement();

            if (useOpenX) {
                const convertSizes = sizes => {
                    return JSON.parse(sizes).filter(x => Array.isArray(x) && x.length === 2).map(x => x.join('x'));
                };

                const activeSlots = Array.from(document.querySelectorAll('as24-ad-slot[sizes]:not([sizes="[]"]):not([out-of-page])'));
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
        });
    })
    .catch(e => {
        console.warn(e);
    });
