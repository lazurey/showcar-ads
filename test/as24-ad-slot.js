import uuid from '../src/js/uuid';

import registerElement from '../src/js/as24-ad-slot';
import { mockGoogletag } from './mocks';

const testContainer = document.createElement('div');
document.body.appendChild(testContainer);

describe('The as24-ad-slot element', () => {
    let tagName;

    beforeEach(() => {
        tagName = `x-${uuid()}`;
        mockGoogletag();
        registerElement(tagName);
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

    it('Elements have refreshAdSlot method', () => {
        const element = document.createElement(tagName);
        expect(element.refreshAdSlot).to.be.exist;
    });

    it('When refreshing then "empty" and "loaded" attributes must be removed when slots really get refreshed', done => {
        testContainer.innerHTML = `<${tagName} size-map-728x300="728x90, 300x50" loaded empty></${tagName}>`;
        const element = document.querySelector(tagName);
        element.refreshAdSlot();

        setTimeout(() => {
            expect(element.attributes.loaded).to.be.undefined;
            expect(element.attributes.empty).to.be.undefined;
            done();
        }, 100);
    });

});
