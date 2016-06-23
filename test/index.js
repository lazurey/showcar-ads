const expect = require('chai').expect;

describe('When script included on the page', () => {
    before(() => {
        require('../src/index.js');
    });

    it ('loads GPT script', () => {
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" slot-id="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.not.be.null;
    });
});
