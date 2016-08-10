import json from 'rollup-plugin-json';

export default {
    entry: 'src/index.js',
    // format: 'cjs',
    // format: 'es6',
    format: 'iife',
    plugins: [ json() ],
    dest: 'dist/index2.js'
};
