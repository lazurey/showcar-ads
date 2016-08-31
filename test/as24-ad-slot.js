import uuid from './uuid';

import registerElement from '../src/as24-ad-slot';

const testContainer = document.createElement('div');
document.body.appendChild(testContainer);

describe('as24-ad-slot element', () => {
    let tagName;

    beforeEach(() => {
        // mockPubads();
        tagName = `x-${uuid()}`;
        registerElement(tagName);
    });

    it('Setting empty attribute on attach to DOM', () => {
        testContainer.innerHTML = `<${tagName}></${tagName}>`;
        const el = document.querySelector(`${tagName}[empty]`);
        expect(el).to.be.ok;
    });

    it('Correctly parsing size-mapping from size-map-*x* attributes', () => {
        testContainer.innerHTML = `<${tagName} size-map-0x0="300x50, 320x100" size-map-728x300="728x90, 300x50"></${tagName}>`;
        const el = document.querySelector(`${tagName}`);

        const sizeMapping = JSON.parse(el.getAttribute('size-mapping'));

        expect(sizeMapping).to.deep.equal([
            [
                [728,300], [[728,90], [300,50]]
            ],
            [
                [0,0], [[300,50], [320,100]]
            ]
        ]);
    });

    it('Automatically sets size map for 0x0 to empty array', () => {
        testContainer.innerHTML = `<${tagName} size-map-728x300="728x90, 300x50"></${tagName}>`;
        const el = document.querySelector(`${tagName}`);

        const sizeMapping = JSON.parse(el.getAttribute('size-mapping'));

        expect(sizeMapping).to.deep.equal([
            [
                [728,300], [[728,90], [300,50]]
            ],
            [
                [0,0], []
            ]
        ]);
    });

});
