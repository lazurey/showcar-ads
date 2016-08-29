'use strict';

import AS24AdSlot from './as24-ad-slot';
import AS24AdTargeting from './as24-ad-targeting';

const start = () => {
    AS24AdSlot.registerElement('as24-ad-slot');
    AS24AdTargeting.registerElement('as24-ad-targeting');
};

export const needToWaitForCookieConsent = () => {
    const host = location.hostname;
    const cookieConsentNeeded = /\.nl$/.test(host) || /\.it$/.test(host) || (location.hash.indexOf('cookie-consent-needed') >= 0);
    const cookieConsentGiven = document.cookie.indexOf('cookieConsent=1;') >= 0;
    return cookieConsentNeeded && !cookieConsentGiven;
};

const shouldDisplayAds = () => {
    const adsAreDisabled = window.location.href.indexOf('ads-off=true') >= 0;
    const isUserDealer = document.cookie.indexOf('CustomerType=D') > 0;
    return !adsAreDisabled && !isUserDealer;
};

if (shouldDisplayAds()) {
    if (needToWaitForCookieConsent()) {
        // waiting for cookie-consent-given event
        // i.e. window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }))
        // TODO: unify event name, see: https://github.com/AutoScout24/contentservice/blob/master/fragments/js/cookieLayer.js
        window.addEventListener('cookie-consent-given', start);
    } else {
        start();
    }
}

export default '';
