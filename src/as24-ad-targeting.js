const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdTargeting extends HTMLElement {

        attachedCallback () {
            this.refreshTargeting();
        }

        detachedCallback() {
            this.refreshTargeting();
        }

        refreshTargeting() {
            const targetingElements = Array.from(document.querySelectorAll(name) || []);
            const targetingObjects = targetingElements.map(el => JSON.parse(el.innerHTML.trim() || '{}'));
            const targeting = {};

            targetingObjects.forEach(obj => Object.assign(targeting, obj));

            googletag.cmd.push(() => {
                const pubads = googletag.pubads();
                const oldTargetingKeys = pubads.getTargetingKeys();

                oldTargetingKeys.forEach(key => pubads.clearTargeting(key));

                for (let key in targeting) {
                    const value = `${targeting[key]}`.split(',');
                    pubads.setTargeting(key, value);
                }
            });
        }
    }

    document.registerElement(name, AS24AdTargeting);
};

export default registerElement;
