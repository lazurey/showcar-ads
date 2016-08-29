module.exports = function(config) {
    config.set({

        files: [
            { pattern: 'src/**/*.js', included: false, served: true, watched: true },
            { pattern: 'test/**/*.js', included: true, served: true, watched: true }
        ],

        browsers: ['Electron'],
        frameworks: ['mocha', 'chai', 'sinon'],
        preprocessors: {
            'test/**/*.js': ['webpack', 'electron']
            // '**/*.js': ['electron']
        },
        client: {
            useIframe: false
        },
        webpack: {
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel?presets[]=es2015'
                }]
            }
        },
        webpackMiddleware: {
            noInfo: true
        },
        reporters: ["mocha"],
        plugins: [
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-sinon",
            "karma-chai",
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
