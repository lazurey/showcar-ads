module.exports = function(config) {
    config.set({

        browsers: ['Electron'],
        electronOpts: { show: false },
        frameworks: ['mocha'],
        files: [
            'test/**/*.js'
        ],

        preprocessors: {
  '**/*.js': ['electron']
},

        // plugins: [
        //     'karma-mocha',
        //     'karma-mocha-reporter',
        //     'karma-electron-launcher'
        // ],

        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
