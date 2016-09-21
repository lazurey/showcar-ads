var cache = null;

module.exports = (gulp, plugins, options) => {
    const rollup = require('rollup');
    const buble = require('rollup-plugin-buble');
    const eslint = require('rollup-plugin-eslint');
    const uglify = require('rollup-plugin-uglify');
    const filesize = require('rollup-plugin-filesize');

    const config = {
        entry: options.js.entry,
        cache,
        plugins: [
            eslint(),
            buble(),
            uglify(),
            filesize(),
        ]
    };

    if (options.env.production) {
        config.plugins.push(uglify());
    }

    config.plugins.push(filesize());

    return rollup.rollup(config).then(bundle => {
        cache = bundle;

        return bundle.write({
            format: 'iife',
            dest: options.js.out,
            sourceMap: true
        });
    });
};
