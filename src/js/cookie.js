export const isUserDealer = () => document.cookie.indexOf('CustomerType=D') > 0;

export const consentNeededAndNotGivenYet = () => {
    const host = location.hostname;
    const cookieConsentNeeded = /\.nl$/.test(host) || /\.it$/.test(host) || (location.hash.indexOf('cookie-consent-needed') >= 0);
    const cookieConsentGiven = document.cookie.indexOf('cookieConsent=1;') >= 0;
    return cookieConsentNeeded && !cookieConsentGiven;
};
