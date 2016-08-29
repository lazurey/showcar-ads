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
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.not.be.null;
    });

    // describe('Resolution checks (X)', () => {
    //
    //     it('If screen x-resolution greater than min-x-resolution then ad slot is filled', () => {
    //         const xres = window.innerWidth;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
    //     });
    //
    //     it('If screen x-resolution less than min-x-resolution then ad slot is NOT filled', () => {
    //         const xres = window.innerWidth;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
    //     });
    //
    //     it('If screen x-resolution greater than max-x-resolution then ad slot is NOT filled', () => {
    //         const xres = window.innerWidth;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
    //     });
    //
    //     it('If screen x-resolution less than max-x-resolution then ad slot is filled', () => {
    //         const xres = window.innerWidth;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-x-resolution="${xres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
    //     });
    // });
    //
    // describe('Resolution checks (Y)', () => {
    //
    //     it('If screen y-resolution greater than min-y-resolution then ad slot is filled', () => {
    //         const yres = window.innerHeight;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
    //     });
    //
    //     it('If screen y-resolution less than min-y-resolution then ad slot is NOT filled', () => {
    //         const yres = window.innerHeight;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" min-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
    //     });
    //
    //     it('If screen y-resolution greater than max-y-resolution then ad slot is NOT filled', () => {
    //         const yres = window.innerHeight;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres-1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
    //     });
    //
    //     it('If screen y-resolution less than max-y-resolution then ad slot is filled', () => {
    //         const yres = window.innerHeight;
    //         document.body.innerHTML += `<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" max-y-resolution="${yres+1}" sizes="[[300,100],[728,90]]"></as24-ad-slot>`;
    //         expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
    //     });
    // });

    describe('When ads slot type not supported', () => {
        it('it should not display any ads', () => {
            document.body.innerHTML += '<as24-ad-slot type="super-ads"></as24-ad-slot>';
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });
    });

    describe('Parameter validation', () => {
        it('Without ad-unit no ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" NO_SLOT_ID_HERE></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('Without valid "sizes" or "size-mappings" no ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" sizes="a"></as24-ad-slot>';
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" size-mapping="a"></as24-ad-slot>';
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" sizes="a" size-mapping="a"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(0);
        });

        it('With valid "sizes" ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" sizes="[]"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });

        it('With valid "size-mapping" ad should be loaded', () => {
            document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" size-mapping="[]"></as24-ad-slot>';
            expect(document.querySelectorAll('as24-ad-slot *').length).to.equal(1);
        });
    });
});

// describe('Targeting', () => {
//     var spy;
//     beforeEach(() => {
//         window.googletag = { cmd: [] };
//         window.googletag.cmd.push(() => {
//             spy = sinon.spy(window.googletag.pubads(), 'setTargeting');
//         });
//
//         loadScript();
//     });
//
//     afterEach(cleanupAfterAdScript);
//
//     it('When as24-ad-targeting element present, targeting params should be set accordingly', (done) => {
//         document.body.innerHTML += '<as24-ad-targeting>{ "a": 1, "b": 2 }</as24-ad-targeting>';
//         document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" size-mapping="[[[0,0],[[300,100]]]]"></as24-ad-slot>';
//
//         window.googletag.cmd.push(() => {
//             setTimeout(() => {
//                 // In setTimeout so that the exceotion of expect are not caught by doubleclick code
//                 expect(spy.callCount).to.equal(2);
//                 expect(spy.calledWithExactly('a', ['1'])).to.be.true;
//                 expect(spy.calledWithExactly('b', ['2'])).to.be.true;
//                 done();
//             });
//         });
//     });
//
//     it('When multiple as24-ad-targeting element present, targeting params should be set accordingly', (done) => {
//         document.body.innerHTML += '<as24-ad-targeting>{ "a": 1, "b": 2 }</as24-ad-targeting>';
//         document.body.innerHTML += '<as24-ad-targeting>{ "c": 1, "b": 8 }</as24-ad-targeting>';
//         document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="1" size-mapping="[[[0,0],[[300,100]]]]"></as24-ad-slot>';
//
//         window.googletag.cmd.push(() => {
//             setTimeout(() => {
//                 // In setTimeout so that the exceotion of expect are not caught by doubleclick code
//                 expect(spy.callCount).to.equal(3);
//                 expect(spy.calledWithExactly('a', ['1'])).to.be.true;
//                 expect(spy.calledWithExactly('b', ['8'])).to.be.true;
//                 expect(spy.calledWithExactly('c', ['1'])).to.be.true;
//                 done();
//             });
//         });
//     });
// });

describe('When user is a dealer', () => {
    beforeEach(() => {
        document.cookie = 'User=CustomerType=D;';
        loadScript();
    });

    afterEach(() => {
        document.cookie = 'User=;expires=0';
        cleanupAfterAdScript();
    });

    it('it should not display any ads', () => {
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.be.null;
    });
});

describe('When ads-off=true is in URL', () => {
    beforeEach(() => {
        window.location.hash = 'ads-off=true';
        loadScript();
    });

    afterEach(() => {
        window.location.hash = '';
        cleanupAfterAdScript();
    });

    it('it should not display any ads', () => {
        document.body.innerHTML += '<as24-ad-slot type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" sizes="[[300,100],[728,90]]"></as24-ad-slot>';
        const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
        expect(script).to.be.null;
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

    it ('hash includes cookie-consent-needed and cookie-consent-given event is fired then ads should be loaded', done => {
        window.dispatchEvent(new Event('cookie-consent-given', { bubbles: true }));

        setTimeout(() => {
            const script = document.querySelector('script[src="https://www.googletagservices.com/tag/js/gpt.js"]');
            expect(script).not.to.be.null;
            done();
        });
    });
});

describe('Size mappings are correct', () => {
    before(() => {
        loadScript();
    });

    after(() => {
        cleanupAfterAdScript();
    });

    it('Derive gpt size mapping correctly', (done) => {
        const rndId = 'xxx' + (Math.random() * 100000 | 0);
        document.body.innerHTML += `<as24-ad-slot id="${rndId}" type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" size-map-0x0="300x50, 320x100"></as24-ad-slot>`;

        window.googletag.cmd.push(() => {
            const parsedSizeMapping = JSON.parse(document.querySelector(`#${rndId}`).getAttribute('size-mapping'));
            const generatedSizeMapping = window.googletag.sizeMapping().addSize([0,0], [[300,50], [320,100]]).build();
            expect(parsedSizeMapping).to.deep.equal(generatedSizeMapping);
            done();
        });
    });

    it('Derive gpt size mapping correctly', (done) => {
        const rndId = 'xxx' + (Math.random() * 100000 | 0);
        document.body.innerHTML += `<as24-ad-slot id="${rndId}" type="doubleclick" ad-unit="/4467/AS24_MOBILEWEBSITE_DE/detailpage_content2" size-map-0x0="300x50, 320x100" size-map-728x300="728x90, 728x300"></as24-ad-slot>`;

        window.googletag.cmd.push(() => {
            const parsedSizeMapping = JSON.parse(document.querySelector(`#${rndId}`).getAttribute('size-mapping'));
            const generatedSizeMapping = window.googletag.sizeMapping()
                        .addSize([728,300], [[728,90], [728,300]])
                        .addSize([0,0], [[300,50], [320,100]])
                        .build();

            expect(parsedSizeMapping).to.deep.equal(generatedSizeMapping);
            done();
        });
    });
});
