const expect = require('chai').expect;
// const sinon = require('sinon');

const loadScript = () => {
    try {
        require('../src/index.js');
    } catch(ex) {
        if (ex.message.indexOf("Registration failed for type 'as24-ad-slot'. A type with that name is already registered.") < 0) {
            throw ex;
        }
    }
};

const cleanupAfterAdScript = () => {
    delete require.cache[require.resolve('../src/index.js')];
    window.googletag = undefined;
    delete window.googletag;
    const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
    if (script) { script.remove(); }

    const adSlots = document.querySelectorAll('as24-ad-slot');
    for (let slot of adSlots) {
        slot.remove();
    }
};

describe('When script included on the page', () => {
    beforeEach(loadScript);
    afterEach(cleanupAfterAdScript);

    it('If there is an ad slot, GPT gets loaded', () => {
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.not.be.null;
    });

    it('If there is no ad slot, GPT does not get loaded either', () => {
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.be.null;
    });

    describe('Resolution checks (X)', () => {

        it('If screen x-resolution greater than min-x-resolution then ad slot is filled', () => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });

        it('If screen x-resolution less than min-x-resolution then ad slot is NOT filled', () => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('If screen x-resolution greater than max-x-resolution then ad slot is NOT filled', () => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('If screen x-resolution less than max-x-resolution then ad slot is filled', () => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });
    });

    describe('Resolution checks (Y)', () => {

        it('If screen y-resolution greater than min-y-resolution then ad slot is filled', () => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });

        it('If screen y-resolution less than min-y-resolution then ad slot is NOT filled', () => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('If screen y-resolution greater than max-y-resolution then ad slot is NOT filled', () => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('If screen y-resolution less than max-y-resolution then ad slot is filled', () => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });
    });

    describe('When ads-off is in URL', () => {
        before(() => window.location.hash = 'ads-off');

        after(() => window.location.hash = '');

        it('it should not display any ads', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).to.be.null;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });
    });

    describe('When ads slot type not supported', () => {
        it('it should not display any ads', () => {
            document.body.innerHTML += '<as24-ad-slot type="super-ads"></as24-ad-slot>';
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).to.be.null;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });
    });

    describe('When user is a dealer', () => {
        before(() => document.cookie = 'User=CustomerType=D;');
        after(() => document.cookie = 'User=;expires=0');

        it('it should not display any ads', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2"></as24-ad-slot>';
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).to.be.null;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });
    });

    describe('Parameter validation', () => {
        it('Without slot-id no ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" NO_SLOT_ID_HERE></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('Without valid "sizes" or "size-mappings" no ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" sizes="a"></as24-ad-slot>';
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" size-mapping="a"></as24-ad-slot>';
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" sizes="a" size-mapping="a"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('With valid "sizes" ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" sizes="[]"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });

        it('With valid "size-mapping" ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" size-mapping="[]"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });

        it('With valid "size-mapping" ad should be loaded and sizes attribute should be calculated and set correctly', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" size-mapping="[[[728,300],[[728,90],[728,300]]],[[0,0],[[300,100],[300,50],[320,50],[320,100]]]]"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
            expect(document.querySelectorAll('as24-ad-slot[sizes="[[728,90],[728,300],[300,100],[300,50],[320,50],[320,100]]"]').length).to.equal(1);
        });
    });

    describe('Targeting', () => {
        var spy;
        before(() => {
            window.googletag = { cmd: [] };
            window.googletag.cmd.push(() => {
                spy = sinon.spy(window.googletag.pubads(), 'setTargeting');
            });
        });

        it('When script[type=adtargeting/json] present, targeting params should be set accordingly', (done) => {
            document.body.innerHTML += '<script type="adtargeting/json">{ "a": 1, "b": 2 }</script>';
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="1" size-mapping="[[[0,0],[[300,100]]]]"></as24-ad-slot>';

            window.googletag.cmd.push(() => {
                setTimeout(() => {
                    // In setTimeout so that the exceotion of expect are not caught by doubleclick code
                    expect(spy.callCount).to.equal(2);
                    expect(spy.calledWithExactly('a', ['1'])).to.be.true;
                    expect(spy.calledWithExactly('b', ['2'])).to.be.true;
                    done();
                });
            });
        });
    });

});

describe('Cookie consent in NL and IT', () => {
    beforeEach(() => {
        location.hash = 'cookie-consent-needed';
        loadScript();
    });

    afterEach(() => {
        location.hash = '';
        cleanupAfterAdScript();
        document.cookie = "cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    });

    it ('hash includes cookie-consent-needed and NO cookie is present, ads should not be loaded', () => {
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.be.null;
    });

    it ('hash includes cookie-consent-needed and cookie-consent-given event is fired, ads should be loaded', done => {
        window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }));

        setTimeout(() => {
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).to.be.null;
            done();
        });
    });
});
