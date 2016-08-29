import registerElement from '../src/as24-ad-targeting';

const uuid = () => {
    // http://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

const mockPubads = () => {
    const currentTargeting = {};

    const pa = {
        clearTargeting(key) { delete currentTargeting[key]; },
        getTargetingKeys() { return Object.keys(currentTargeting); },
        setTargeting(key, value) { currentTargeting[key] = value; }
    };

    window.googletag = {
        cmd: [],
        pubads() {
            return pa;
        }
    };
};

const testContainer = document.createElement('div');
document.body.appendChild(testContainer);

describe('Targeting with custom element', () => {
    let tagName;

    beforeEach(() => {
        mockPubads();
        tagName = `x-${uuid()}`;
    });

    afterEach(done => {
        testContainer.innerHTML = '';
        delete window.googletag;

        setTimeout(done, 100);
    });

    it('sets targeting basic targeting values', () => {
        const setTargetingSpy = sinon.spy(window.googletag.pubads(), 'setTargeting');

        registerElement(tagName);
        testContainer.innerHTML += `<${tagName}>{ "a": 1, "b": 2 }</${tagName}>`;

        window.googletag.cmd.forEach(cmd => { cmd()});

        expect(setTargetingSpy.callCount).to.equal(2);
        expect(setTargetingSpy.firstCall.calledWith('a', ['1'])).to.be.true;
        expect(setTargetingSpy.secondCall.calledWith('b', ['2'])).to.be.true;
    });

    it('sets targeting with multiple custom elements', () => {
        const setTargetingSpy = sinon.spy(window.googletag.pubads(), 'setTargeting');
        const clearTargetingSpy = sinon.spy(window.googletag.pubads(), 'clearTargeting');

        registerElement(tagName);
        testContainer.innerHTML = `<${tagName}>{ "a": 1, "b": 2 }</${tagName}><${tagName}>{ "b": 3, "c": 4, "d": 5 }</${tagName}>`;

        window.googletag.cmd.forEach(cmd => cmd());

        expect(window.googletag.pubads().getTargetingKeys()).to.deep.equal(['a', 'b', 'c', 'd']);
        expect(clearTargetingSpy.callCount).to.equal(4);
        expect(setTargetingSpy.callCount).to.equal(8);
    });
});
