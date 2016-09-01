import { gptinit } from '../src/double-click';

import { mockGoogletag } from './mocks';

describe('Doubleclick', () => {

    beforeEach(mockGoogletag);

    it('Initialization is correct', () =>{
        const esrSpy = sinon.spy(window.googletag.pubads(), 'enableSingleRequest');
        const dilSpy = sinon.spy(window.googletag.pubads(), 'disableInitialLoad');
        const esSpy = sinon.spy(window.googletag, 'enableServices');

        gptinit();

        expect(googletag.cmd.length).to.equal(1);

        window.googletag.cmd.forEach(cmd => cmd());

        expect(esrSpy.callCount).to.equal(1);
        expect(dilSpy.callCount).to.equal(1);
        expect(esSpy.callCount).to.equal(1);
    });

    
});
