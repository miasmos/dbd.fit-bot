var webpack = require('webpack'),
    nodeExternals = require('webpack-node-externals'),
    path = require('path');

module.exports = {
    mode: 'production',
    entry: './app/index.js',
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules'),
            path.resolve('.'),
            path.resolve('../dbd.gg')
        ]
    },
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: __dirname + '/dist',
        filename: 'index.compiled.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ]
};
