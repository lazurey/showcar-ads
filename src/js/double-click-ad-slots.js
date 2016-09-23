import debounce from 'lodash/debounce';
import uuid from './uuid';
import { isElementInViewport } from './dom';
import googletag from './googletag';

const slotsCache = {};

const destroyAdSlotById = id => {
    const slot = slotsCache[id].slot;
    googletag().cmd.push(() => googletag().destroySlots([slot]));
};

const refreshAdSlotById = id => {
    const x = slotsCache[id];
    if (x) {
        x.waitsForRefresh = true;
        refreshAdslotsWaitingToBeRefreshed();
    }
};

const register = ({ adunit, container, outOfPage, sizeMapping, slotElement }) => {
    const id = uuid();

    const ret = {
        refresh: () => refreshAdSlotById(id),
        destroy: () => destroyAdSlotById(id)
    };

    slotsCache[id] = {
        ret,
        container,
        slotElement
    };

    googletag().cmd.push(() => {
        const pubads = googletag().pubads();
        const slot = outOfPage
        ? googletag().defineOutOfPageSlot(adunit, container.id).addService(pubads)
        : googletag().defineSlot(adunit, [], container.id).defineSizeMapping(sizeMapping).addService(pubads);

        googletag().display(container.id);

        slotsCache[id].slot = slot;
        refreshAdSlotById(id);
    });

    return ret;
};

const refreshAdslotsWaitingToBeRefreshed = debounce(() => {
    const slotsToRefresh = [];

    Object.keys(slotsCache).forEach(id => {
        const x = slotsCache[id];

        if (x.waitsForRefresh && isElementInViewport(x.slotElement)) {
            slotsToRefresh.push(x.slot);
            x.waitsForRefresh = false;
        }
    });

    googletag().cmd.push(() => {
        googletag().pubads().refresh(slotsToRefresh, { changeCorrelator: false });
    });
}, 50);

const findXIdByGptSlot = slot => {
    const xs = Object.keys(slotsCache).filter(id => {
        return slotsCache[id].slot === slot;
    }).map(id => slotsCache[id]);

    return xs.length ? xs[0] : null;
};

googletag().cmd.push(() => {
    const pubads = googletag().pubads();
    pubads.addEventListener('slotOnload', eventData => {
        const x = findXIdByGptSlot(eventData.slot);
        x && x.ret.onload && x.ret.onload();
    });

    pubads.addEventListener('slotRenderEnded', eventData => {
        if (eventData.isEmpty) {
            const x = findXIdByGptSlot(eventData.slot);
            x && x.ret.onempty && x.ret.onempty();
        }
    });
});

window.addEventListener('load', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('scroll', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('animationend', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('transitionend', refreshAdslotsWaitingToBeRefreshed);

export default register;

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
