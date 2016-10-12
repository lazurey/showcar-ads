const fs = require('fs');

var cache = null;

module.exports = (gulp, plugins, options) => {
    const rollup = require('rollup');
    const buble = require('rollup-plugin-buble');
    const eslint = require('rollup-plugin-eslint');
    const uglify = require('rollup-plugin-uglify');
    const filesize = require('rollup-plugin-filesize');


    // TODO remove commonj + nodeReolve
    const commonjs = require('rollup-plugin-commonjs');
    const nodeResolve = require('rollup-plugin-node-resolve');

    const config = {
        entry: options.js.entry,
        cache,
        plugins: [
            eslint(),
            nodeResolve({ jsnext: true, main: true }),
            commonjs(),
            buble()
        ]
    };

    if (options.env.production) {
        config.plugins.push(uglify());
    }

    config.plugins.push(filesize());

    return rollup.rollup(config).then(bundle => {
        cache = bundle;

        const result = bundle.generate({
            format: 'iife',
            sourceMap: true
        });

        const sourceMapFileUrl = process.env.CI_BUILD_REF_NAME ? `/showcar-ads/${process.env.CI_BUILD_REF_NAME}/${process.env.CI_BUILD_REF}/index.js.map` : 'index.js.map';
        fs.writeFileSync(options.js.out, `${result.code}\n//# sourceMappingURL=${sourceMapFileUrl}`);
        fs.writeFileSync(`${options.js.out}.map`, result.map.toString());
    });
};
