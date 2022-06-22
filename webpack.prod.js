// @ts-check

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        // https://webpack.js.org/guides/caching/
        moduleIds: 'deterministic',
        splitChunks: {
            chunks: 'all',
        },
    },
});
