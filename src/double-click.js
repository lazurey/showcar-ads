import { setAttribute, getAttribute } from './dom';

export const parseSizeMappingFromElement = element => {

    const parseResolution = str => {
        const matches = str.replace(/[\s]/g, '').match(/([\d]+)x([\d]+)/i);

        if (matches && matches[2]) {
            return [matches[1] | 0, matches[2] | 0];
        }

        return null;
    };

    const sizeMaps = [].slice.call(element.attributes).filter(x => /size-map-/.test(x.nodeName)).map(x => ({ name: x.nodeName, value: x.value }));

    if (sizeMaps.length > 0) {

        const parsedSizeMaps = sizeMaps.map(m => {
            return [parseResolution(m.name), m.value.split(',').map(parseResolution).filter(r => r && r[0] && r[1])];
        });

        parsedSizeMaps.sort((a, b) => {
            const ax = a[0][0];
            const ay = a[0][1];

            const bx = b[0][0];
            const by = b[0][1];

            if (ax === bx) { return ay - by };
            return bx - ax;
        });

        const smallest = parsedSizeMaps[parsedSizeMaps.length - 1];
        if (smallest[0][0] !== 0 || smallest[0][1] !== 0) {
            parsedSizeMaps.push([[0,0],[]])
        }

        setAttribute(element, 'size-mapping', JSON.stringify(parsedSizeMaps));

        const pageResolution = {
            x: window.innerWidth,
            y: window.innerHeight
        };

        for (let i = 0; i < parsedSizeMaps.length; i++) {
            const m = parsedSizeMaps[i];
            const q = pageResolution.x >= m[0][0] && pageResolution.y >= m[0][1];

            if (q) {
                const sizes = m[1];

                if (sizes.length <= 0) {
                    // Not showing ad slot due to size map restrictions.
                    return;
                }

                break;
            }
        }
    }

};
