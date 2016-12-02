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

const register = ({ adunit, container, outOfPage, sizeMapping, slotElement, immediate, collapseEmpty, openxIgnore }) => {
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

        if(collapseEmpty) {
            slot.setCollapseEmptyDiv(true);
        }

        googletag().display(container.id);

        slotsCache[id].slot = slot;
        slotsCache[id].outOfPage = outOfPage;
        slotsCache[id].immediate = immediate;
        slotsCache[id].openxIgnore = openxIgnore;

        refreshAdSlotById(id);


    });

    return ret;
};

var refreshOxBids = false;

const refreshAdslotsWaitingToBeRefreshed = debounce(() => {
    const slotsToRefresh = [];

    Object.keys(slotsCache).forEach(id => {
        const x = slotsCache[id];

        if (x.waitsForRefresh && (x.outOfPage || isElementInViewport(x.slotElement) || x.immediate)) {
            slotsToRefresh.push(x);
            x.waitsForRefresh = false;
            x.ret.onrefresh && x.ret.onrefresh();
        }
    });

    if (slotsToRefresh.length > 0) {
        googletag().cmd.push(() => {
            const usingOpenX = window.OX && window.OX.dfp_bidder && window.OX.dfp_bidder.refresh && window.OX.dfp_bidder.setOxTargeting;

            const openxSlotsToRefresh = slotsToRefresh.filter(s => !s.openxIgnore).map(s => s.slot);
            const allSlotsToRefresh = slotsToRefresh.map(s => s.slot);

            if (usingOpenX) {
                if (refreshOxBids) {
                    const onrefresh = () => {
                        window.OX.dfp_bidder.setOxTargeting(openxSlotsToRefresh);
                        googletag().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
                    };

                    const to = setTimeout(() => { console.log('TO'); onrefresh(); }, 1500);

                    window.OX.dfp_bidder.refresh(() => {
                        clearTimeout(to);
                        onrefresh();
                    }, openxSlotsToRefresh);
                } else {
                    refreshOxBids = true;
                    window.OX.dfp_bidder.setOxTargeting(openxSlotsToRefresh);
                    googletag().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
                }

                return;
            }

            googletag().pubads().refresh(allSlotsToRefresh, { changeCorrelator: false });
        });
    }
}, 50);

const findXIdByGptSlot = slot => {
    const xs = Object.keys(slotsCache).filter(id => {
        return slotsCache[id].slot === slot;
    }).map(id => slotsCache[id]);

    return xs.length ? xs[0] : null;
};

googletag().cmd.push(() => {
    const pubads = googletag().pubads();

    pubads.addEventListener('slotRenderEnded', eventData => {
        const x = findXIdByGptSlot(eventData.slot);

        if (eventData.isEmpty) {
            x && x.ret.onempty && x.ret.onempty();
        }
        else {
            x && x.ret.onload && x.ret.onload();
        }
    });
});

window.addEventListener('load', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('scroll', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('animationend', refreshAdslotsWaitingToBeRefreshed);
window.addEventListener('transitionend', refreshAdslotsWaitingToBeRefreshed);

export default register;

export const gptinit = () => {
    googletag().cmd.push(() => {
        const pubads = googletag().pubads();
        pubads.enableSingleRequest();
        pubads.disableInitialLoad();
        googletag().enableServices();
    });
};
