import { loadScript } from './dom';

export const loadIndexExchange = () => {
    const tld = location.hostname.split('.').pop();

    if (tld === 'de') loadScript('//js-sec.indexww.com/ht/p/185725-52080520089380.js');
    else if (tld === 'at') loadScript('//js-sec.indexww.com/ht/p/185725-71871796647060.js');
    else if (tld === 'it') loadScript('//js-sec.indexww.com/ht/p/185725-124648354720881.js');
    else if (tld === 'nl') loadScript('//js-sec.indexww.com/ht/p/185725-60876680248506.js');
};
