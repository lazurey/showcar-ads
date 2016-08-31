const buble = require('rollup-plugin-buble');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

module.exports = function(config) {
    config.set({

        files: [
            { pattern: 'src/**/*.js', included: false, served: true, watched: true },
            { pattern: 'test/**/*.js', included: true, served: true, watched: true }
        ],

        browsers: ['Electron'],
        frameworks: ['mocha', 'chai-as-promised', 'chai', 'sinon'],
        client: {
            useIframe: false
        },

        preprocessors: {
            'test/**/*.js': ['rollup']
        },
        rollupPreprocessor: {
            plugins: [
                nodeResolve(),
                commonjs(),
                buble()
            ],
            format: 'iife',
            sourceMap: 'inline',
            moduleName: 'qwqwq'
        },
        reporters: ['mocha'],
        plugins: [
            'karma-mocha-reporter',
            'karma-mocha',
            'karma-sinon',
            'karma-chai',
            'karma-electron',
            'karma-rollup-plugin',
            'karma-chai-as-promised'
        ],

        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
