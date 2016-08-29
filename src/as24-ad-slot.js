const registerElement = name => {
    const googletag = window.googletag || (window.googletag = { cmd: [] });

    class AS24AdSlot extends HTMLElement {
        // createdCallback() {}
        attachedCallback () {}
        detachedCallback() {}

        refreshAdSlot() {}
    }

    document.registerElement(name || 'as24-ad-slot', AS24AdSlot);
};

export default registerElement;
