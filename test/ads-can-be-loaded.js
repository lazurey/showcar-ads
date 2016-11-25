import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import waitUntilAdsCanBeLoaded from '../src/js/ads-can-be-loaded';

describe('Loading ads', () => {
    afterEach(() => {
        document.cookie = 'User=;expires=0';
        window.location.hash = '';
    });

    it('Do not load ads when ads=off in URL', () => {
        window.location.hash = 'ads-off=true';
        return waitUntilAdsCanBeLoaded().should.be.rejected;
    });

    it('Do not load ads when user is a dealer', () => {
        document.cookie = 'User=CustomerType=D;';
        return waitUntilAdsCanBeLoaded().should.be.rejected;
    });

    it('Wait until cookie consent is given', () => {
        window.location.hash = 'cookie-consent-needed';
        setTimeout(() => window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true })));
        return waitUntilAdsCanBeLoaded().should.eventually.be.fulfilled;
    });
});
