import waitUntilAdsCanBeLoaded from './ads-can-be-loaded';

import registerAdSlotElement from './as24-ad-slot';
import registerAdTargetingElement from './as24-ad-targeting';
import { gptinit } from './double-click-ad-slots';
import { loadScript, ready } from './dom';

waitUntilAdsCanBeLoaded()
    .then(() => {
        const useOpenX = location.href.indexOf('ads-openx=true') >= 0;

        if (!useOpenX) {
            loadScript('https://www.googletagservices.com/tag/js/gpt.js');
        }

        ready(() => {
            gptinit();
            registerAdSlotElement();
            registerAdTargetingElement();

            if (useOpenX) {
                const convertSizes = sizes => {
                    return JSON.parse(sizes).map(x => x.join('x'));
                };

                const activeSlots = Array.from(document.querySelectorAll('as24-ad-slot[sizes]:not([sizes="[]"]):not([out-of-page])'));
                window.OX_dfp_ads = activeSlots.map(element => [element.getAttribute('ad-unit'), convertSizes(element.getAttribute('sizes')), element.children[0].id]);
                loadScript('https://scout24-d.openx.net/w/1.0/jstag?nc=4467-autoscout');

                var oxTimeout;
                const oxCallback = () => {
                    clearTimeout(oxTimeout);
                    loadScript('https://www.googletagservices.com/tag/js/gpt.js');
                };

                oxTimeout = setTimeout(oxCallback, 3000);
                window.OX_dfp_options = { callback: oxCallback };
            }
        });
    });
