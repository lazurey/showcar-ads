import json from 'rollup-plugin-json';

export default {
    entry: 'src/index.js',
    // format: 'cjs',
    format: 'es6',
    plugins: [ json() ],
    dest: 'dist/index2.js'
};
