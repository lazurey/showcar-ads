module.exports = function(config) {
    config.set({

        files: [
            { pattern: 'src/**/*.js', included: false, served: true, watched: true },
            { pattern: 'test/**/*.js', included: true, served: true, watched: true }
        ],

        browsers: ['Electron'],
        // browsers: ['Chrome'],

        // electronOpts: { show: false },

        frameworks: ['mocha'],

        preprocessors: {
            // '**/*.js': ['babel', 'electron']
            // '**/*.js': ['electron']
            'test/**/*.js': ['webpack']
        },

        // babelPreprocessor: {
        //     options: {
        //         presets: ['es2015'],
        //         sourceMap: 'inline'
        //     },
        //       filename: function (file) {
        //         return file.originalPath.replace(/\.js$/, '.es5.js');
        //       },
        //       sourceFileName: function (file) {
        //         return file.originalPath;
        //       }
        // },

        reporters: ["mocha"],
        plugins: [
            "karma-mocha-reporter",
            "karma-mocha",
            "karma-electron",
            "karma-webpack"
            // "karma-babel"
        ],

        client: {
            mocha: {
                reporter: 'html'
            }
        }
    });
};
