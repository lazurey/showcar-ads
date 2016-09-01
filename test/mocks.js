export const mockGoogletag = () => {
    const currentTargeting = {};

    const pa = {
        clearTargeting(key) { delete currentTargeting[key]; },
        getTargetingKeys() { return Object.keys(currentTargeting); },
        setTargeting(key, value) { currentTargeting[key] = value; },
        enableSingleRequest() {},
        disableInitialLoad() {},
        collapseEmptyDivs() {}
    };

    window.googletag = {
        cmd: [],
        enableServices() {},
        pubads() {
            return pa;
        }
    };
};
