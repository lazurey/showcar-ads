import { parseAttributesIntoValidMapping, mappingHasSizesForResolution } from '../src/js/size-mapping';

const createAttribute = (name, value) => {
    return {
        nodeName: name,
        value
    };
};

describe('Size mapping', () => {
    it('Happy case', () => {
        const attributes = [
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-728x200', '600x100'),
        ];

        const mapping = parseAttributesIntoValidMapping(attributes);

        expect(mapping).to.deep.equal([
            [[728, 200], [[600, 100]]],
            [[0, 0], [[300, 100], [300, 50]]]
        ]);
    });

    it('Without 0x0 mapping, default empty sizes array should be added', () =>{
        const attributes = [
            createAttribute('size-map-728x200', '600x100'),
        ];

        const mapping = parseAttributesIntoValidMapping(attributes);

        expect(mapping).to.deep.equal([
            [[728, 200], [[600, 100]]],
            [[0, 0], []]
        ]);
    });

    it('Size mapping should be sorted by resolution from greater to smaller', () => {
        const attributes1 = [
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-728x200', '600x100'),
            createAttribute('size-map-1024x0', '600x300, 600x100'),
            createAttribute('size-map-1400x1', '600x400, 600x300'),
            createAttribute('size-map-1400x0', '600x400, 600x300')
        ];

        const attributes2 = [
            createAttribute('size-map-1400x1', '600x400, 600x300'),
            createAttribute('size-map-1400x0', '600x400, 600x300'),
            createAttribute('size-map-1024x0', '600x300, 600x100'),
            createAttribute('size-map-728x200', '600x100'),
            createAttribute('size-map-0x0', '300x100, 300x50')
        ];

        const attributes3 = [
            createAttribute('size-map-728x200', '600x100'),
            createAttribute('size-map-1024x0', '600x300, 600x100'),
            createAttribute('size-map-1400x0', '600x400, 600x300'),
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-1400x1', '600x400, 600x300')
        ];

        const attributes4 = [
            createAttribute('size-map-728x200', '600x100'),
            createAttribute('size-map-1400x0', '600x400, 600x300'),
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-1400x1', '600x400, 600x300'),
            createAttribute('size-map-1024x0', '600x300, 600x100')
        ];

        const expectedMapping = [
            [[1400, 1], [[600, 400], [600, 300]]],
            [[1400, 0], [[600, 400], [600, 300]]],
            [[1024, 0], [[600, 300], [600, 100]]],
            [[728, 200], [[600, 100]]],
            [[0, 0], [[300, 100], [300, 50]]]
        ];

        expect(parseAttributesIntoValidMapping(attributes1)).to.deep.equal(expectedMapping);
        expect(parseAttributesIntoValidMapping(attributes2)).to.deep.equal(expectedMapping);
        expect(parseAttributesIntoValidMapping(attributes3)).to.deep.equal(expectedMapping);
        expect(parseAttributesIntoValidMapping(attributes4)).to.deep.equal(expectedMapping);
    });

    it('Empty mapping should be tolerated', () => {
        const attributes = [];
        expect(parseAttributesIntoValidMapping(attributes)).to.deep.equal([[[0,0], []]]);
    });

    it('Mapping with empty sizes is tolerated', () => {
        const attributes = [
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-1024x768', '600x300, 600x100'),
            createAttribute('size-map-728x200', '')
        ];

        expect(parseAttributesIntoValidMapping(attributes)).to.deep.equal([
            [[1024, 768], [[600, 300], [600, 100]]],
            [[728, 200], []],
            [[0, 0], [[300, 100], [300, 50]]]
        ]);
    });

    it('mappingHasSizesForResolution', () => {
        const emptyMapping = [];
        const mapping1 = parseAttributesIntoValidMapping([
            createAttribute('size-map-0x0', '300x100, 300x50'),
            createAttribute('size-map-1024x768', '600x300, 600x100'),
            createAttribute('size-map-728x200', '')
        ]);

        const resolution = { x: 1024, y: 768 };
        const resolutionSmall = { x: 460, y: 240 };
        const resolutionMedium = { x: 800, y: 600 };

        expect(mappingHasSizesForResolution(emptyMapping, resolution)).to.be.false;
        expect(mappingHasSizesForResolution(mapping1, resolution)).to.be.true;
        expect(mappingHasSizesForResolution(mapping1, resolutionSmall)).to.be.true;
        expect(mappingHasSizesForResolution(mapping1, resolutionMedium)).to.be.false;
    });
});
