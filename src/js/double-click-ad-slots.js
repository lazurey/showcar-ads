import debounce from 'lodash/debounce';

import uuid from './uuid';

import { isElementInViewport } from './dom';

// const googletag = window.googletag || (window.googletag = { cmd: [] });

import googletag from './googletag';

const slotsCache = {};

const destroyAdSlotById = id => {
    const slot = slotsCache[id].slot;
    window.googletag.cmd.push(() => window.googletag.destroySlots([slot]));
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

    window.googletag.cmd.push(() => {
        const pubads = googletag.pubads();
        const slot = outOfPage
        ? window.googletag.defineOutOfPageSlot(adunit, container.id).addService(pubads)
        : window.googletag.defineSlot(adunit, [], container.id).defineSizeMapping(sizeMapping).addService(pubads);

        window.googletag.display(container.id);

        slotsCache[id].slot = slot;
        refreshAdSlotById(id);
    });

    const ret = {
        refresh: () => refreshAdSlotById(id),
        destroy: () => destroyAdSlotById(id)
    };

    slotsCache[id] = {
        ret,
        container,
        slotElement
    };

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

    window.googletag.cmd.push(() => {
        // window.googletag.pubads().refresh(slotsToRefresh, { changeCorrelator: false });
        window.googletag.pubads().refresh(slotsToRefresh);
    });
}, 50);

window.addEventListener('load', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('scroll', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('animationend', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('transitionend', refreshAdslotsWaitingToBeRefreshed);


setTimeout(refreshAdslotsWaitingToBeRefreshed, 100); // TODO: check this

export default register;
