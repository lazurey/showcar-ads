const expect = require('chai').expect;

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

        it('If screen x-resolution greater than min-x-resolution then ad slot is filled', done => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
                done();
            }, 100);
        });

        it('If screen x-resolution less than min-x-resolution then ad slot is NOT filled', done => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
                done();
            }, 100);
        });

        it('If screen x-resolution greater than max-x-resolution then ad slot is NOT filled', done => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
                done();
            }, 100);
        });

        it('If screen x-resolution less than max-x-resolution then ad slot is filled', done => {
            const xres = window.innerWidth;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
                done();
            }, 100);
        });
    });

    describe('Resolution checks (Y)', () => {

        it('If screen y-resolution greater than min-y-resolution then ad slot is filled', done => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
                done();
            }, 100);
        });

        it('If screen y-resolution less than min-y-resolution then ad slot is NOT filled', done => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
                done();
            }, 100);
        });

        it('If screen y-resolution greater than max-y-resolution then ad slot is NOT filled', done => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
                done();
            }, 100);
        });

        it('If screen y-resolution less than max-y-resolution then ad slot is filled', done => {
            const yres = window.innerHeight;
            document.body.innerHTML += `<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
            setTimeout(() => {
                expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
                done();
            }, 100);
        });
    });

    describe('When ads-off is in URL', () => {
        before(() =>{
            window.location.hash = 'ads-off';
        });

        after(() => {
            window.location.hash = '';
        });

        it('it should not display any ads', done => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).to.be.null;
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
            done();
        });
    });
});
