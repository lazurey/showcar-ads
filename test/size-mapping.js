import { parseAttributesIntoValidMapping, mappingHasSizesForResolution } from '../src/js/size-mapping';

const createAttribute = (name, value) => {
    return {
        nodeName: name,
        value
    };
};

describe('Size mapping', () => {

    it('blah', () => {
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
});
