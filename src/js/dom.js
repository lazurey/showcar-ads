export const getAttribute = (el, attributeName, fallback) => {
    return (el && el.getAttribute && el.getAttribute(attributeName)) || fallback;
};

export const hasAttribute = (el, attributeName) => {
    return el && el.hasAttribute(attributeName);
};

export const setAttribute = (el, attributeName, value) => {
    return el && el.setAttribute(attributeName, value);
};

export const removeAttribute = (el, attributeName) => {
    return el && el.removeAttribute(attributeName);
};

export const loadScript = url => {
    const script = document.createElement('script');
    const s = document.getElementsByTagName('script')[0];
    script.src = url;
    s.parentNode.insertBefore(script, s);
};

export const ready = () => {
    return new Promise(resolve => {
        if (document.readyState !== 'loading') {
            return resolve();
        }

        document.addEventListener('DOMContentLoaded', resolve);
    });
};

export const isElementInViewport = element => {
    if (!element || !document.body.contains(element)) { return false; }
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    return rect.bottom > 0
        && rect.top < windowHeight
        && rect.right > 0
        && rect.left < windowWidth;
};

export const addCss = ruleText => {
    const el = document.createElement('style');
    el.innerHTML = ruleText;
    document.querySelector('head').appendChild(el);
};
