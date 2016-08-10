const getAttribute = (el, attributeName, fallback) => {
    return (el && el.getAttribute && el.getAttribute(attributeName)) || fallback;
};

const hasAttribute = (el, attributeName) => el.hasAttribute(attributeName);

const loadScript = url => {
    const script = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    script.src = url;
    s.parentNode.insertBefore(script, s);
};

const domready = fn => {
    if (document.readyState !== 'loading') {
        return setTimeout(fn);
    }

    document.addEventListener("DOMContentLoaded", fn);
};

export { getAttribute, hasAttribute, loadScript, domready };
