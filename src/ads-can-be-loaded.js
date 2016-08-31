const waitUntilAdsCanBeLoaded = () => {
    const loc = window.location;
    const cookie = document.cookie;
    const adsAreDisabled = loc.href.indexOf('ads-off=true') >= 0;
    const isUserDealer = cookie.indexOf('CustomerType=D') > 0;

    if (adsAreDisabled || isUserDealer) { return Promise.reject(); }

    const needToWaitForCookieConsent = () => {
        const host = loc.hostname;
        const cookieConsentNeeded = /\.(nl|it)$/.test(host) || (loc.hash.indexOf('cookie-consent-needed') >= 0);
        const cookieConsentGiven = cookie.indexOf('cookieConsent=1;') >= 0;
        return cookieConsentNeeded && !cookieConsentGiven;
    };

    if (needToWaitForCookieConsent()) {
        return new Promise(resolve => window.addEventListener('cookie-consent-given', resolve));
    }

    return Promise.resolve();
};

export default waitUntilAdsCanBeLoaded;
