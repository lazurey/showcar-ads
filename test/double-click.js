import { gptinit, parseResolution, adsFormatsUnderResolution, isSizeMappingAttribute, sortSizeMapping, findAdSizes } from '../src/js/double-click';

import { mockGoogletag } from './mocks';

describe('Doubleclick', () => {

    describe('utilities', () => {

        describe('parseResolution', () => {

            it('should return an array of two Ints with width and height', () => {
                // given
                let resolution = '123x987';

                // when
                let result = parseResolution(resolution);

                // then
                expect(result).to.have.length(2);
                expect(result).to.deep.equal([123, 987]);
            });

            it('should return null when the resolution string is misformatted', () => {
                // given
                let resolution = '123x';

                // when
                let result = parseResolution(resolution);

                // then
                expect(result).to.equal(null);
            });

        });

        describe('isSizeMappingAttribute', () => {

            it('should true if the attribute name represents size mapping', () => {
                // given
                let attrName = 'size-map-123x123';

                // when
                let result = isSizeMappingAttribute(attrName);

                // then
                expect(result).to.equal(true);
            });

            it('should false if attribute name is not a size mapping or misformatted', () => {
                // given
                let attrName1 = 'size-map123x123';
                let attrName2 = 'class';

                // when
                let result1 = isSizeMappingAttribute(attrName1);
                let result2 = isSizeMappingAttribute(attrName2);

                // then
                expect(result1).to.equal(false);
                expect(result2).to.equal(false);
            });

        });

        describe('sortSizeMapping', () => {

            it('should sort things out', () => {
                // given
                let mapping = [
                    [[300, 300], []],
                    [[100, 100], []],
                    [[100, 150], []],
                    [[200, 200], []]
                ];
                let expected = [
                    [[300, 300], []],
                    [[200, 200], []],
                    [[100, 150], []],
                    [[100, 100], []]
                ];

                // when
                let result = mapping.sort(sortSizeMapping);

                // then
                expect(result).to.deep.equal(expected);
            });

        });

        describe('adsFormatsUnderResolution function§', () => {
            it('should filter out formats for higher resolutions', () => {
                // given
                let resultion = {
                    x: 768,
                    y: 480
                };
                let mapping = [
                    [ [1024, 400], [[0, 0], [1, 1]] ],
                    [ [640, 480], [[300, 50], [320, 100]] ],
                    [ [200, 30], [ [0, 0], [0, 0] ] ],
                    [ [0, 0], [ [0, 0], [0, 0] ] ]
                ];
                let expected = [
                    [ [640, 480], [[300, 50], [320, 100]] ],
                    [ [200, 30], [ [0, 0], [0, 0] ] ],
                    [ [0, 0], [ [0, 0], [0, 0] ] ]
                ];

                // when
                let result = adsFormatsUnderResolution(resultion, mapping);

                // then
                expect(result).to.deep.equal(expected);
            });

            it('should not fail if the data is empty', () => {
                // given
                let resultion = {
                    x: 768,
                    y: 480
                };

                let mapping = [];

                let expected = [];

                // when
                let result = adsFormatsUnderResolution(resultion, mapping);

                // then
                expect(result).to.deep.equal(expected);
            });
        });

        describe("findAdSizes function", () => {
            it('should return an empty array if there is nothing after filtering', () => {
                // given
                let resultion = {
                    x: 768,
                    y: 480
                };
                let mappings = [
                    [ [1024, 400], [[0, 0], [1, 1]] ],
                    [ [640, 480], [[300, 50], [320, 100]] ],
                    [ [200, 30], [ [0, 0], [0, 0] ] ],
                    [ [0, 0], [ [0, 0], [0, 0] ] ]
                ];
                let expected = [[300, 50], [320, 100]];

                // when
                let result = findAdSizes(adsFormatsUnderResolution(resultion, mappings));

                // then
                expect(result).to.deep.equal(expected);
            });
        });

    });

    describe('Google tag', () => {
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

});
