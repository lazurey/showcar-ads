const once = fn => {
    let count = 1;
    let memo;

    return () => {
        if (count-- > 0) {
            memo = fn();
        }

        return memo;
    };
};

const batch = fn => {
    const arr = [];
    let to;

    return arg => {
        arr.push(arg);
        clearTimeout(to);
        to = setTimeout(() => {
            fn(arr);
            arr.length = 0;
        }, 50);
    };
};

const debounce = (fn, delay) => {
    let timer = null;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};

// const logBatch = batch(tx => console.log(tx, 'ASDF'));
//
// logBatch('qwe1');
// logBatch('qwe2');
// logBatch('qwe3');
// logBatch('qwe4');

// Simple check to disable ads when ads-off is in the URL
// e.g. example.com/list#ads-off OR example.com/details?ads-off
const adsAreDisabled = () => window.location.href.indexOf('ads-off=true') >= 0;

export { once, adsAreDisabled, batch, debounce };
