module.exports = function(config) {
    config.set({

        files: [
            { pattern: 'src/**/*.js', included: false, served: true, watched: true },
            { pattern: 'test/**/*.js', included: true, served: true, watched: true }
        ],

        browsers: ['Electron'],
        frameworks: ['mocha'],
        preprocessors: {
            'test/**/*.js': ['webpack']
        },

        webpackMiddleware: {
            noInfo: true
        },
        reporters: ["mocha"],
        plugins: [
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-electron",
            "karma-webpack"
        ],

        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
