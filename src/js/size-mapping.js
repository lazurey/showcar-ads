import first from 'lodash/first';
import last from 'lodash/last';

const parseResolution = str => {
    const matches = str.replace(/[\s]/g, '').match(/([\d]+)x([\d]+)/i);

    if (matches && matches[2]) {
        return [matches[1] | 0, matches[2] | 0];
    }

    return null;
};

export const parseAttributes = attributes => {

    return Array.from(attributes).filter(x => {
        return /size-map-/.test(x.nodeName);
    }).map(x => {
        return [
            parseResolution(x.nodeName),
            x.value.split(',').map(parseResolution).filter(x => Array.isArray(x) && x.length === 2)
        ];
    });
};

export const consolidateSizeMapping = mapping => {
    const ensureMappingHas0x0Mapping = m => {
        const lastElement = last(m);

        if (!lastElement || lastElement[0][0] !== 0 || lastElement[0][1] !== 0) {
            mapping.push([[0, 0],[]]);
        }

        return mapping;
    };

    const sortedMapping = mapping.sort((x, y) => {
        return (y[0][0] - x[0][0]) || (y[0][1] - x[0][1]);
    });

    const mappingWith0x0Mapping = ensureMappingHas0x0Mapping(sortedMapping);

    return mappingWith0x0Mapping;
};

export const getEligibleSizesForResolution = (mapping, resolution) => {
    const fe =  first(mapping.filter(x => x[0][0] <= resolution.x && x[0][1] <= resolution.y));
    return (fe && fe[1]) || [];
};

export const parseAttributesIntoValidMapping = attributes => {
    const x1 = parseAttributes(attributes);
    const x2 = consolidateSizeMapping(x1);

    return x2;
};
