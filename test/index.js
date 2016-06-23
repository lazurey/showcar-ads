const expect = require('chai').expect;

describe('When script included on the page', () => {
    beforeEach(() => {
        try {
        require('../src/index.js');
        } catch(ex) {
            if (ex.message.indexOf("Registration failed for type 'as24-ad-slot'. A type with that name is already registered.") < 0) {
                throw ex;
            }
        }
    });

    afterEach(() => {
        delete require.cache[require.resolve('../src/index.js')];
        delete window.googletag;
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        if (script) { script.remove(); }

        const adSlots = document.querySelectorAll('as24-ad-slot');
        for (let slot of adSlots) {
            slot.remove();
        }
    });

    it('If there is no ad slot, GPT does not get loaded either', () => {
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.not.be.null;
    });

    it('If there is no ad slot, GPT does not get loaded either', () => {
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.be.null;
    });
});
