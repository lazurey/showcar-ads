import { loadScript } from './dom';

export const loadIndexExchange = () => {
    const tld = location.hostname.split('.').pop();

    if (tld !== 'de') return false;

    loadScript('//js-sec.indexww.com/ht/p/185725-52080520089380.js');
};
