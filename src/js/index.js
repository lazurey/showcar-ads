import waitUntilAdsCanBeLoaded from './ads-can-be-loaded';

import registerAdSlotElement from './as24-ad-slot';
import registerAdTargetingElement from './as24-ad-targeting';
import { gptinit } from './double-click-ad-slots';
import { loadScript } from './dom';

waitUntilAdsCanBeLoaded()
    .then(() => {
        loadScript('https://www.googletagservices.com/tag/js/gpt.js');
        gptinit();
        registerAdSlotElement();
        registerAdTargetingElement();
    });
