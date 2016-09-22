export const asArray = xs => Array.prototype.slice.call(xs);

export const once = fn => {
    let count = 1;
    let memo;

    return () => {
        if (count-- > 0) {
            memo = fn();
        }

        return memo;
    };
};

export const batch = fn => {
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

export const debounce = (fn, delay) => {
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
