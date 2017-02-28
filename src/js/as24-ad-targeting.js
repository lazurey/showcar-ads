import { addCss } from './dom';

const registerElement = (name = 'as24-ad-targeting') => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    const AS24AdTargetingPrototype = Object.create(HTMLElement.prototype,  {

        attachedCallback: {
            value: function() {
                this.refreshTargeting();
            }
        },

        detachedCallback: {
            value: function() {
                this.refreshTargeting();
            }
        },

        refreshTargeting: {
            value: function() {
                const targeting = getTargetingData(name);

                googletag.cmd.push(() => {
                    const pubads = googletag.pubads();
                    const oldTargetingKeys = pubads.getTargetingKeys();

                    oldTargetingKeys.forEach(key => pubads.clearTargeting(key));

                    for (let key in targeting) {
                        const value = `${targeting[key]}`.split(',');
                        pubads.setTargeting(key, value);
                    }

                    if (window.Krux) {
                        pubads.setTargeting('ksg', window.Krux.segments);
                        pubads.setTargeting('kuid', window.Krux.user);
                    }
                });
            }
        }
    });

    addCss(`${name}{display:none}`);
    document.registerElement(name, { prototype: AS24AdTargetingPrototype });
};

export default registerElement;

export const getTargetingData = (tagName) => {
    const targetingElements = Array.from(document.querySelectorAll(tagName) || []);
    const targetingObjects = targetingElements.map(el => JSON.parse(el.innerHTML.trim() || '{}'));
    const targeting = {};

    targetingObjects.forEach(obj => Object.assign(targeting, obj));

    return targeting;
};
