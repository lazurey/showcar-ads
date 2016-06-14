module.exports = function(config) {
    config.set({

        files: [
            { pattern: 'src/**/*.js', included: false, served: true, watched: true },
            { pattern: 'test/**/*.js', included: true, served: true, watched: true }
        ],

        browsers: ['Electron'],
        electronOpts: { show: false },

        frameworks: ['mocha'],

        preprocessors: {
            '**/*.js': ['electron']
        },

        reporters: ["mocha"],
        plugins: [
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-electron"
        ],

        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
