const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdSlot extends HTMLElement {
        // createdCallback() {}
        attachedCallback () {}
        detachedCallback() {}

        refreshAdSlot() {}
    }

    document.registerElement(name, AS24AdTargeting);
};

export default registerElement;
