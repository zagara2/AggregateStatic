const path = require('path');

module.exports = {

    entry: './client.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },

    module: {
        loaders: [{

                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            }

        ]

    }
};