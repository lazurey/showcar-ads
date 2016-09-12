import { asArray } from './helpers';
import { setAttribute, getAttribute } from './dom';

export const parseResolution = str => {
    const matches = str.replace(/[\s]/g, '').match(/([\d]+)x([\d]+)/i);

    if (matches && matches[2]) {
        return [matches[1] | 0, matches[2] | 0];
    }

    return null;
};

export const isSizeMappingAttribute = (attrName) => {
    return /size-map-/.test(attrName);
};

export const sortSizeMapping = (a, b) => {
    const ahead = a[0];
    const bhead = b[0];

    const ax = ahead[0];
    const ay = ahead[1];

    const bx = bhead[0];
    const by = bhead[1];

    if (ax === bx) { return by - ay };
    return bx - ax;
};

export const sizeFitsTheScreen = (_a, mappingFor) => {
    var x = _a.x, y = _a.y;
    return x >= mappingFor[0] && y >= mappingFor[1];
}

export const adsFormatsUnderResolution = (res, mappings) => {
    return mappings.filter(m => sizeFitsTheScreen(res, m[0]));
}

export const findAdSizes = (mappings) => {
    return mappings[0][1];
}

export const parseSizeMappingFromElement = element => {

    const parsedSizeMaps = asArray(element.attributes)
        .filter(x => isSizeMappingAttribute(x.nodeName))
        .map(m => [parseResolution(m.nodeName), m.value.split(',').map(parseResolution).filter(r => r && r[0] && r[1])])
        .sort(sortSizeMapping);

    if (parsedSizeMaps.length > 0) {

        const smallest = parsedSizeMaps[parsedSizeMaps.length - 1];
        if (smallest[0][0] !== 0 || smallest[0][1] !== 0) {
            parsedSizeMaps.push( [ [0,0], [] ] );
        }

        setAttribute(element, 'size-mapping', JSON.stringify(parsedSizeMaps));

        const pageResolution = {
            x: window.innerWidth,
            y: window.innerHeight
        };

        let eligibleAdSizes = findAdSizes(adsFormatsUnderResolution(pageResolution, parsedSizeMaps));

        if (!eligibleAdSizes.length) {
            return;
        }
    }
};

export const gptinit = () => {
    window.googletag.cmd.push(() => {
        const pubads = window.googletag.pubads();
        pubads.enableSingleRequest();
        pubads.collapseEmptyDivs(true);
        pubads.disableInitialLoad();
        // pubads.enableAsyncRendering(); // TODO: check this
        googletag.enableServices();
    });
};

export const registerAdSlot = (adunit, element, sizeMapping, outOfPage) => {
    window.googletag.cmd.push(() => {
        const pubads = googletag.pubads();

        outOfPage
            ? window.googletag.defineOutOfPageSlot(adunit, element.id).addService(window.googletag.pubads())
            : window.googletag.defineSlot(adunit, [], element.id).defineSizeMapping(sizeMapping).addService(window.googletag.pubads());

        window.googletag.display(element.id);
    });
};

export const refreshAdSlot = slot => {

};

export const destroyAdSlot = slot => {
    window.googletag.cmd.push(() => window.googletag.destroySlots([slot]));
};
